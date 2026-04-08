'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  factoryMetrics,
  machineTypes,
  gaugeCapabilities,
  exportCountries,
  FACTORY_COORDS,
} from '@/data/factory';

/* ────────── Dict type ────────── */
interface FactoryDashboardDict {
  machineFleet: string;
  machinesSubtitle: string;
  gaugeDistribution: string;
  gaugeSubtitle: string;
  exportNetwork: string;
  exportSubtitle: string;
  factory: string;
  activeMarket: string;
  istanbulHQ: string;
  regions: Record<string, string>;
  metrics?: Record<
    string,
    {
      label: string;
      description: string;
    }
  >;
  machineTypeNames?: Record<string, string>;
  gaugeNames?: Record<string, string>;
}

/* ────────────────────────────────────────────
   Animated counter hook
   ──────────────────────────────────────────── */
function useCounter(end: number, duration = 2000, start = false) {
  const [value, setValue] = useState(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * end));
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [end, duration, start]);

  return value;
}

/* ────────────────────────────────────────────
   Metric card with animated counter
   ──────────────────────────────────────────── */
function MetricCard({
  label,
  value,
  suffix,
  icon,
  description,
  delay,
}: {
  label: string;
  value: number;
  suffix: string;
  icon: string;
  description: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const count = useCounter(value, 2200, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay }}
      className="group relative overflow-hidden rounded-2xl border border-white/6 bg-brand-dark-2 p-6 transition-all duration-300 hover:border-brand-accent/20 hover:shadow-glow"
    >
      {/* Glow accent on hover */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-brand-accent/5 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-brand-accent/10">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-brand-accent-light"
          >
            <path d={icon} />
          </svg>
        </div>

        <div className="mb-1 font-display text-3xl font-bold tabular-nums text-brand-white md:text-4xl">
          {count.toLocaleString()}
          <span className="text-brand-accent-light">{suffix}</span>
        </div>
        <div className="mb-2 text-sm font-medium text-brand-white">{label}</div>
        <p className="text-xs leading-relaxed text-brand-grey">{description}</p>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────
   Machine type bar chart
   ──────────────────────────────────────────── */
function MachineChart({ dict }: { dict: FactoryDashboardDict }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const total = machineTypes.reduce((s, m) => s + m.count, 0);

  const getTypeName = (typeId: string, fallback: string) =>
    dict.machineTypeNames?.[typeId] ?? fallback;

  return (
    <div ref={ref} className="rounded-2xl border border-white/6 bg-brand-dark-2 p-6">
      <h4 className="mb-1 font-display text-base font-semibold text-brand-white">
        {dict.machineFleet}
      </h4>
      <p className="mb-6 text-xs text-brand-grey">
        {dict.machinesSubtitle.replace('{total}', String(total))}
      </p>

      <div className="space-y-5">
        {machineTypes.map((m, i) => (
          <div key={m.name}>
            <div className="mb-1.5 flex items-center justify-between">
              <div>
                <span className="text-sm font-medium text-brand-white">{getTypeName(m.id ?? '', m.name ?? '')}</span>
                <span className="ml-2 text-xs text-brand-grey">{m.gauge}</span>
              </div>
              <span className="text-sm font-bold tabular-nums text-brand-accent-light">
                {m.count}
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-brand-dark-3">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-brand-accent-dark to-brand-accent-light"
                initial={{ width: 0 }}
                animate={inView ? { width: `${(m.count / total) * 100}%` } : {}}
                transition={{ duration: 1, delay: 0.2 + i * 0.15, ease: [0.25, 0, 0.25, 1] }}
              />
            </div>
            <div className="mt-1 text-[10px] text-brand-grey">{m.brand}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Gauge capability donut-style progress
   ──────────────────────────────────────────── */
function GaugeChart({ dict }: { dict: FactoryDashboardDict }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  const getGaugeName = (gaugeId: string, fallback: string) =>
    dict.gaugeNames?.[gaugeId] ?? fallback;

  return (
    <div ref={ref} className="rounded-2xl border border-white/6 bg-brand-dark-2 p-6">
      <h4 className="mb-1 font-display text-base font-semibold text-brand-white">
        {dict.gaugeDistribution}
      </h4>
      <p className="mb-6 text-xs text-brand-grey">
        {dict.gaugeSubtitle}
      </p>

      {/* Stacked horizontal bar */}
      <div className="mb-5 flex h-5 overflow-hidden rounded-full bg-brand-dark-3">
        {gaugeCapabilities.map((g, i) => (
          <motion.div
            key={g.gauge}
            initial={{ width: 0 }}
            animate={inView ? { width: `${g.percentage}%` } : {}}
            transition={{ duration: 1, delay: 0.3 + i * 0.1, ease: [0.25, 0, 0.25, 1] }}
            className="h-full first:rounded-l-full last:rounded-r-full"
            style={{ backgroundColor: g.color }}
            title={`${g.gauge}: ${g.percentage}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {gaugeCapabilities.map((g) => (
          <div key={g.gauge} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: g.color }} />
              <span className="text-brand-white">{getGaugeName(g.id ?? '', g.gauge ?? '')}</span>
              <span className="text-brand-grey">({g.range})</span>
            </div>
            <span className="font-medium tabular-nums text-brand-accent-light">{g.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Interactive export map (canvas)
   ──────────────────────────────────────────── */
function ExportMapInteractive({ dict }: { dict: FactoryDashboardDict }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const dotsRef = useRef<{ x: number; y: number; name: string; region: string }[]>([]);

  // Mercator-like projection
  const project = useCallback((lat: number, lng: number, w: number, h: number) => {
    const x = ((lng + 180) / 360) * w;
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = h / 2 - (w * mercN) / (2 * Math.PI);
    return { x, y };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    const ctx = canvas.getContext('2d')!;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = '#111118';
    ctx.fillRect(0, 0, cw, ch);

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.02)';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < cw; i += 40) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, ch); ctx.stroke();
    }
    for (let i = 0; i < ch; i += 40) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(cw, i); ctx.stroke();
    }

    // Istanbul (factory)
    const factory = project(FACTORY_COORDS.lat, FACTORY_COORDS.lng, cw, ch);

    // Store dots for hover detection
    const dots: typeof dotsRef.current = [];

    // Draw connection lines + dots
    exportCountries.forEach((c) => {
      const p = project(c.lat, c.lng, cw, ch);
      dots.push({ x: p.x, y: p.y, name: c.name, region: c.region });

      // Arc connection line
      ctx.beginPath();
      ctx.moveTo(factory.x, factory.y);
      const midX = (factory.x + p.x) / 2;
      const midY = Math.min(factory.y, p.y) - 20;
      ctx.quadraticCurveTo(midX, midY, p.x, p.y);
      ctx.strokeStyle =
        hoveredCountry === c.name
          ? 'rgba(212,188,106,0.35)'
          : 'rgba(201,168,76,0.06)';
      ctx.lineWidth = hoveredCountry === c.name ? 1.5 : 0.5;
      ctx.stroke();

      // Dot
      const isHovered = hoveredCountry === c.name;
      ctx.beginPath();
      ctx.arc(p.x, p.y, isHovered ? 5 : 3, 0, Math.PI * 2);
      ctx.fillStyle = isHovered ? '#D4BC6A' : 'rgba(201,168,76,0.5)';
      ctx.fill();

      if (isHovered) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(212,188,106,0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    dotsRef.current = dots;

    // Factory marker
    ctx.beginPath();
    ctx.arc(factory.x, factory.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#C9A84C';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(factory.x, factory.y, 12, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(201,168,76,0.3)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = '600 10px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#D4BC6A';
    ctx.textAlign = 'left';
    ctx.fillText(dict.istanbulHQ, factory.x + 16, factory.y + 4);
  }, [hoveredCountry, project, dict.istanbulHQ]);

  useEffect(() => { draw(); }, [draw]);

  useEffect(() => {
    const handler = () => draw();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [draw]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      setMousePos({ x: e.clientX, y: e.clientY });

      let found: string | null = null;
      for (const dot of dotsRef.current) {
        const dx = mx - dot.x;
        const dy = my - dot.y;
        if (dx * dx + dy * dy < 200) {
          found = dot.name;
          break;
        }
      }
      setHoveredCountry(found);
    },
    [],
  );

  return (
    <div className="rounded-2xl border border-white/6 bg-brand-dark-2 p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h4 className="font-display text-base font-semibold text-brand-white">
            {dict.exportNetwork}
          </h4>
          <p className="text-xs text-brand-grey">
            {dict.exportSubtitle}
          </p>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-brand-grey">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-brand-accent" />
            {dict.factory}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-brand-accent/50" />
            {dict.activeMarket}
          </span>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative aspect-[2/1] w-full overflow-hidden rounded-xl"
      >
        <canvas
          ref={canvasRef}
          className="h-full w-full cursor-crosshair"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredCountry(null)}
        />
        {/* Tooltip */}
        {hoveredCountry && canvasRef.current && (
          <div
            className="pointer-events-none fixed z-50 rounded-lg border border-brand-accent/30 bg-brand-dark/95 px-3 py-1.5 text-xs shadow-lg backdrop-blur-sm"
            style={{
              left: mousePos.x + 14,
              top: mousePos.y - 30,
            }}
          >
            <span className="font-medium text-brand-white">{hoveredCountry}</span>
          </div>
        )}
      </div>

      {/* Region summary */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(['europe', 'asia', 'americas', 'africa'] as const).map((region) => {
          const count = exportCountries.filter((c) => c.region === region).length;
          return (
            <div
              key={region}
              className="rounded-xl bg-brand-dark-3 px-3 py-2 text-center"
            >
              <div className="text-lg font-bold tabular-nums text-brand-accent-light">
                {count}
              </div>
              <div className="text-[10px] capitalize text-brand-grey">{dict.regions[region] ?? region}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────
   Main dashboard export
   ──────────────────────────────────────────── */
export default function FactoryDashboard({ dict }: { dict: FactoryDashboardDict }) {
  const localizedMetrics = factoryMetrics.map((m) => ({
    ...m,
    label: dict.metrics?.[m.id]?.label ?? m.label,
    description: dict.metrics?.[m.id]?.description ?? m.description,
  }));

  return (
    <div className="space-y-10">
      {/* Metric cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {localizedMetrics.map((m, i) => (
          <MetricCard key={m.id} {...m} delay={i * 0.08} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <MachineChart dict={dict} />
        <GaugeChart dict={dict} />
      </div>

      {/* Export Map */}
      <ExportMapInteractive dict={dict} />
    </div>
  );
}
