'use client';

import { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ────────── colour swatches ────────── */
const COLOR_KEYS = ['navy', 'charcoal', 'cream', 'wine', 'sage', 'gold'] as const;
const COLOR_HEX: Record<string, string> = {
  navy: '#1e3a5f',
  charcoal: '#3a3a42',
  cream: '#c5baa8',
  wine: '#6b2d3e',
  sage: '#7a9a7e',
  gold: '#C9A84C',
};

/* ────────── Knit garment (procedural mesh) ────────── */
function KnitGarment({ color, viewSide }: { color: string; viewSide: 'front' | 'back' }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const targetRotation = useRef(viewSide === 'front' ? 0 : Math.PI);

  // Smooth side-switch
  useFrame(() => {
    if (!meshRef.current) return;
    targetRotation.current = viewSide === 'front' ? 0 : Math.PI;
    meshRef.current.rotation.y +=
      (targetRotation.current - meshRef.current.rotation.y) * 0.05;
  });

  const knitNormalMap = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    
    // Base — neutral normal
    ctx.fillStyle = '#8080ff';
    ctx.fillRect(0, 0, size, size);

    // Knit V-loop pattern
    ctx.strokeStyle = '#6060ef';
    ctx.lineWidth = 1.5;
    for (let y = 0; y < size; y += 12) {
      for (let x = 0; x < size; x += 10) {
        ctx.beginPath();
        ctx.arc(x + 5, y + 6, 4, 0, Math.PI, false);
        ctx.stroke();
      }
    }

    // Horizontal rows
    ctx.strokeStyle = '#7070f0';
    ctx.lineWidth = 0.5;
    for (let y = 0; y < size; y += 12) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(size, y);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 8);
    return tex;
  }, []);

  const roughnessMap = useMemo(() => {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#999';
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 6) {
      for (let x = 0; x < size; x += 6) {
        const v = 130 + Math.random() * 50;
        ctx.fillStyle = `rgb(${v},${v},${v})`;
        ctx.fillRect(x, y, 6, 6);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(6, 8);
    return tex;
  }, []);

  // Build polo-shirt–like geometry from lathe
  const geometry = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    // Bottom hem
    pts.push(new THREE.Vector2(0.45, -1.2));
    pts.push(new THREE.Vector2(0.47, -1.18));
    // Torso
    pts.push(new THREE.Vector2(0.48, -0.8));
    pts.push(new THREE.Vector2(0.5, -0.3));
    // Chest
    pts.push(new THREE.Vector2(0.52, 0));
    // Shoulder
    pts.push(new THREE.Vector2(0.48, 0.3));
    pts.push(new THREE.Vector2(0.42, 0.45));
    // Neck taper
    pts.push(new THREE.Vector2(0.25, 0.55));
    pts.push(new THREE.Vector2(0.18, 0.6));
    // Collar top
    pts.push(new THREE.Vector2(0.2, 0.72));
    pts.push(new THREE.Vector2(0.22, 0.78));

    const geo = new THREE.LatheGeometry(pts, 64);
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow>
      <meshStandardMaterial
        color={color}
        normalMap={knitNormalMap}
        normalScale={new THREE.Vector2(0.8, 0.8)}
        roughnessMap={roughnessMap}
        roughness={0.85}
        metalness={0.0}
        envMapIntensity={0.3}
      />
    </mesh>
  );
}

/* ────────── Collar ring ────────── */
function CollarRing({ color }: { color: string }) {
  const darkerColor = useMemo(() => {
    const c = new THREE.Color(color);
    c.multiplyScalar(0.7);
    return '#' + c.getHexString();
  }, [color]);

  return (
    <mesh position={[0, 0.75, 0]}>
      <torusGeometry args={[0.21, 0.04, 16, 48]} />
      <meshStandardMaterial color={darkerColor} roughness={0.9} />
    </mesh>
  );
}

/* ────────── Scene ────────── */
function Scene({ color, viewSide }: { color: string; viewSide: 'front' | 'back' }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
      <directionalLight position={[-3, 3, -3]} intensity={0.3} />
      <pointLight position={[0, 2, 3]} intensity={0.4} color="#D4BC6A" />

      <KnitGarment color={color} viewSide={viewSide} />
      <CollarRing color={color} />

      <ContactShadows
        position={[0, -1.25, 0]}
        opacity={0.4}
        scale={3}
        blur={2.5}
      />

      <Environment preset="studio" />

      <OrbitControls
        enablePan={false}
        minDistance={1.5}
        maxDistance={5}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.5}
        autoRotate
        autoRotateSpeed={0.5}
      />
    </>
  );
}

/* ────────── Loading fallback ────────── */
function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-2 border-brand-dark-3 border-t-brand-accent" />
    </div>
  );
}

/* ────────── Dict type ────────── */
interface KnitwearViewerDict {
  colors: Record<string, string>;
  badge: string;
  hint: string;
  infoTitle: string;
  infoDesc: string;
  colourLabel: string;
  viewLabel: string;
  front: string;
  back: string;
}

/* ────────── Main Export ────────── */
export default function KnitwearViewer({ dict }: { dict: KnitwearViewerDict }) {
  const [activeColor, setActiveColor] = useState(COLOR_HEX.navy);
  const [viewSide, setViewSide] = useState<'front' | 'back'>('front');
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="relative w-full">
      {/* 3D Canvas */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/5 bg-brand-dark md:aspect-[3/4] lg:aspect-[4/5]">
        <Suspense fallback={<LoadingSpinner />}>
          <Canvas
            camera={{ position: [0, 0.3, 3], fov: 40 }}
            dpr={[1, 2]}
            gl={{ antialias: true, alpha: false }}
            style={{ background: '#111113' }}
          >
            <Scene color={activeColor} viewSide={viewSide} />
          </Canvas>
        </Suspense>

        {/* HUD overlays */}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full bg-brand-accent/20 px-3 py-1 text-xs font-semibold text-brand-accent-light backdrop-blur-sm">
            {dict.badge}
          </span>
        </div>

        {/* Zoom hint */}
        <div className="absolute bottom-4 left-4 text-[10px] text-brand-grey/60">
          {dict.hint}
        </div>

        {/* Info toggle */}
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-brand-dark/60 text-brand-grey backdrop-blur-sm transition-colors hover:text-brand-white"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
        </button>

        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute right-4 top-14 w-56 rounded-xl border border-white/10 bg-brand-dark/90 p-4 text-xs backdrop-blur-md"
            >
              <h4 className="mb-2 font-display font-semibold text-brand-white">{dict.infoTitle}</h4>
              <p className="text-brand-grey leading-relaxed">
                {dict.infoDesc}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Color swatches */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wider text-brand-grey">
            {dict.colourLabel}
          </span>
          <div className="flex gap-2">
            {COLOR_KEYS.map((key) => (
              <button
                key={key}
                onClick={() => setActiveColor(COLOR_HEX[key])}
                title={dict.colors[key] ?? key}
                className={cn(
                  'h-7 w-7 rounded-full border-2 transition-all',
                  activeColor === COLOR_HEX[key]
                    ? 'scale-110 border-brand-accent-light shadow-glow'
                    : 'border-transparent hover:border-white/20',
                )}
                style={{ backgroundColor: COLOR_HEX[key] }}
              />
            ))}
          </div>
        </div>

        {/* Front / Back toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-brand-grey">
            {dict.viewLabel}
          </span>
          <div className="flex rounded-full border border-white/10 bg-brand-dark-2">
            {(['front', 'back'] as const).map((side) => (
              <button
                key={side}
                onClick={() => setViewSide(side)}
                className={cn(
                  'rounded-full px-4 py-1.5 text-xs font-medium capitalize transition-all',
                  viewSide === side
                    ? 'bg-brand-accent/20 text-brand-accent-light'
                    : 'text-brand-grey hover:text-brand-white',
                )}
              >
                {side === 'front' ? dict.front : dict.back}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
