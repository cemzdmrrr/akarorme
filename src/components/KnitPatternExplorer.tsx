'use client';
import { cn } from '@/lib/utils';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  yarnTypes,
  knitTechniques,
  gaugeLevels,
  getFabricResult,
} from '@/data/patterns';

/* ────────── Canvas-based knit texture preview ────────── */
function FabricPreview({
  techniqueId,
  gaugeId,
  yarnColor,
}: {
  techniqueId: string;
  gaugeId: string;
  yarnColor: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth * dpr;
    const h = canvas.clientHeight * dpr;
    canvas.width = w;
    canvas.height = h;
    ctx.scale(dpr, dpr);
    const cw = canvas.clientWidth;
    const ch = canvas.clientHeight;

    // Background
    ctx.fillStyle = '#111113';
    ctx.fillRect(0, 0, cw, ch);

    const baseHue = yarnColor;
    const cellSize =
      gaugeId === 'fine' ? 6 : gaugeId === 'medium' ? 12 : 20;

    ctx.globalAlpha = 0.95;

    if (techniqueId === 'single-jersey' || techniqueId === 'interlock') {
      // V-stitch loops
      for (let y = 0; y < ch + cellSize; y += cellSize) {
        for (let x = 0; x < cw + cellSize; x += cellSize) {
          const off = (Math.floor(y / cellSize) % 2) * (cellSize / 2);
          ctx.beginPath();
          ctx.arc(x + off, y, cellSize * 0.35, 0, Math.PI, false);
          ctx.strokeStyle = baseHue;
          ctx.lineWidth = cellSize * 0.22;
          ctx.stroke();
          if (techniqueId === 'interlock') {
            ctx.beginPath();
            ctx.arc(x + off, y + cellSize * 0.2, cellSize * 0.25, Math.PI, 0, false);
            ctx.strokeStyle = shadeColor(baseHue, -25);
            ctx.lineWidth = cellSize * 0.15;
            ctx.stroke();
          }
        }
      }
    } else if (techniqueId === 'rib') {
      // Vertical rib columns
      for (let x = 0; x < cw; x += cellSize * 2) {
        ctx.fillStyle = baseHue;
        ctx.fillRect(x, 0, cellSize, ch);
        ctx.fillStyle = shadeColor(baseHue, -20);
        ctx.fillRect(x + cellSize, 0, cellSize, ch);
      }
      // Horizontal stitch lines
      ctx.strokeStyle = shadeColor(baseHue, -30);
      ctx.lineWidth = 0.5;
      for (let y = 0; y < ch; y += cellSize * 0.8) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(cw, y);
        ctx.stroke();
      }
    } else if (techniqueId === 'jacquard') {
      // Checkerboard pattern with color alternation
      const c2 = shadeColor(baseHue, 30);
      for (let y = 0; y < ch; y += cellSize) {
        for (let x = 0; x < cw; x += cellSize) {
          const check = ((Math.floor(x / cellSize) + Math.floor(y / cellSize)) % 2 === 0);
          ctx.fillStyle = check ? baseHue : c2;
          ctx.fillRect(x, y, cellSize, cellSize);
          // Stitch detail
          ctx.beginPath();
          ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.25, 0, Math.PI, false);
          ctx.strokeStyle = 'rgba(0,0,0,0.15)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    } else if (techniqueId === 'cable') {
      // Cable twist pattern
      ctx.fillStyle = baseHue;
      ctx.fillRect(0, 0, cw, ch);
      const cableW = cellSize * 3;
      ctx.strokeStyle = shadeColor(baseHue, -18);
      ctx.lineWidth = cellSize * 0.5;
      for (let bx = 0; bx < cw; bx += cableW * 2) {
        for (let by = 0; by < ch; by += cellSize * 4) {
          ctx.beginPath();
          ctx.moveTo(bx + cableW * 0.2, by);
          ctx.bezierCurveTo(
            bx + cableW * 0.8, by + cellSize,
            bx + cableW * 0.8, by + cellSize * 3,
            bx + cableW * 0.2, by + cellSize * 4,
          );
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(bx + cableW * 0.8, by);
          ctx.bezierCurveTo(
            bx + cableW * 0.2, by + cellSize,
            bx + cableW * 0.2, by + cellSize * 3,
            bx + cableW * 0.8, by + cellSize * 4,
          );
          ctx.stroke();
        }
      }
    }

    // Light overlay for depth
    const grad = ctx.createRadialGradient(cw / 2, ch / 2, 0, cw / 2, ch / 2, cw * 0.7);
    grad.addColorStop(0, 'rgba(255,255,255,0.04)');
    grad.addColorStop(1, 'rgba(0,0,0,0.15)');
    ctx.globalAlpha = 1;
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cw, ch);
  }, [yarnColor, techniqueId, gaugeId]);

  useEffect(() => { draw(); }, [draw]);

  useEffect(() => {
    const handler = () => draw();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="h-full w-full rounded-xl"
      style={{ imageRendering: 'auto' }}
    />
  );
}

function shadeColor(hex: string, amt: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amt));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const b = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/* ────────── Stat bar ────────── */
function StatBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-28 shrink-0 text-xs text-brand-grey">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-brand-dark-3">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-accent to-brand-accent-light"
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: [0.25, 0, 0.25, 1] }}
        />
      </div>
      <span className="w-8 text-right text-xs font-medium text-brand-white">{value}%</span>
    </div>
  );
}

/* ────────── Step indicator ────────── */
type StepIndicatorProps = {
  step: number;
  total: number;
  labels?: string[];
};

function StepIndicator({ step, total, labels }: StepIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-1">
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className="flex items-center gap-1">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300',
                i < step
                  ? 'bg-brand-accent text-white'
                  : i === step
                    ? 'border-2 border-brand-accent text-brand-accent-light'
                    : 'border border-brand-dark-4 text-brand-grey',
              )}
            >
              {i < step ? '✓' : i + 1}
            </div>
            {i < total - 1 && (
              <div
                className={cn(
                  'h-0.5 w-8 rounded-full transition-all duration-300 sm:w-12',
                  i < step ? 'bg-brand-accent' : 'bg-brand-dark-3',
                )}
              />
            )}
          </div>
        ))}
      </div>
      {labels && (
        <div className="flex items-center gap-1 mt-2">
          {labels.map((label, i) => (
            <div key={i} className={cn(
              'w-20 text-center text-xs',
              i === step ? 'text-brand-accent-light font-semibold' : 'text-brand-grey'
            )}>
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ────────── Selection card ────────── */
function SelectionCard({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative rounded-xl border p-4 text-left transition-all duration-300',
        selected
          ? 'border-brand-accent bg-brand-accent/10 shadow-glow'
          : 'border-white/6 bg-brand-dark-2 hover:border-white/12',
      )}
    >
      {selected && (
        <motion.div
          layoutId="selection-ring"
          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-accent text-[10px] font-bold text-white"
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
        >
          ✓
        </motion.div>
      )}
      {children}
    </motion.button>
  );
}

/* ────────── Main Export ────────── */
/* ────────── Dict type ────────── */
interface PatternExplorerDict {
  back: string;
  next: string;
  steps: {
    yarn: { title: string; desc: string };
    technique: { title: string; desc: string };
    gauge: { title: string; desc: string };
  };
  weightLabel: string;
  resultTitle: string;
  resultDesc: string;
  bestFor: string;
  performance: string;
  stats: Record<string, string>;
  startOver: string;
  stepLabels: { yarn: string; technique: string; gauge: string; result: string };
}

export default function KnitPatternExplorer({ dict }: { dict: PatternExplorerDict }) {
  const [step, setStep] = useState(0);
  const [yarnId, setYarnId] = useState<string | null>(null);
  const [techniqueId, setTechniqueId] = useState<string | null>(null);
  const [gaugeId, setGaugeId] = useState<string | null>(null);

  const showResult = yarnId && techniqueId && gaugeId;
  const result = showResult ? getFabricResult(yarnId, techniqueId, gaugeId) : null;
  const selectedYarn = yarnTypes.find((y) => y.id === yarnId);

  const goNext = () => setStep((s) => Math.min(s + 1, 3));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-brand-dark-2 p-6">
      {/* Step indicator */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <StepIndicator
          step={step}
          total={4}
          labels={[dict.stepLabels.yarn, dict.stepLabels.technique, dict.stepLabels.gauge, dict.stepLabels.result]}
        />
        <div className="flex gap-2">
          {step > 0 && (
            <button
              onClick={goBack}
              className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium text-brand-grey transition-colors hover:text-brand-white"
            >
              {dict.back}
            </button>
          )}
          {step < 3 && (
            <button
              onClick={goNext}
              disabled={
                (step === 0 && !yarnId) ||
                (step === 1 && !techniqueId) ||
                (step === 2 && !gaugeId)
              }
              className="rounded-full bg-brand-accent/20 px-4 py-1.5 text-xs font-medium text-brand-accent-light transition-colors hover:bg-brand-accent/30 disabled:cursor-not-allowed disabled:opacity-30"
            >
              {dict.next}
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ───── Step 0: Yarn ───── */}
        {step === 0 && (
          <motion.div
            key="yarn"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="mb-1 font-display text-lg font-semibold text-brand-white">
              {dict.steps.yarn.title}
            </h3>
            <p className="mb-6 text-sm text-brand-grey">
              {dict.steps.yarn.desc}
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {yarnTypes.map((y) => (
                <SelectionCard
                  key={y.id}
                  selected={yarnId === y.id}
                  onClick={() => { setYarnId(y.id); setTimeout(goNext, 250); }}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: y.color }}
                    />
                    <span className="font-display text-sm font-semibold text-brand-white">
                      {y.name}
                    </span>
                  </div>
                  <p className="mb-2 text-xs text-brand-grey">{y.origin}</p>
                  <div className="flex flex-wrap gap-1">
                    {y.properties.map((p) => (
                      <span
                        key={p}
                        className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-brand-grey-light"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </SelectionCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* ───── Step 1: Technique ───── */}
        {step === 1 && (
          <motion.div
            key="technique"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="mb-1 font-display text-lg font-semibold text-brand-white">
              {dict.steps.technique.title}
            </h3>
            <p className="mb-6 text-sm text-brand-grey">
              {dict.steps.technique.desc}
            </p>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {knitTechniques.map((t) => (
                <SelectionCard
                  key={t.id}
                  selected={techniqueId === t.id}
                  onClick={() => { setTechniqueId(t.id); setTimeout(goNext, 250); }}
                >
                  <span className="mb-1 block font-display text-sm font-semibold text-brand-white">
                    {t.name}
                  </span>
                  <p className="mb-2 text-xs leading-relaxed text-brand-grey">{t.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {t.characteristics.map((c) => (
                      <span
                        key={c}
                        className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-brand-grey-light"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </SelectionCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* ───── Step 2: Gauge ───── */}
        {step === 2 && (
          <motion.div
            key="gauge"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="mb-1 font-display text-lg font-semibold text-brand-white">
              {dict.steps.gauge.title}
            </h3>
            <p className="mb-6 text-sm text-brand-grey">
              {dict.steps.gauge.desc}
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {gaugeLevels.map((g) => (
                <SelectionCard
                  key={g.id}
                  selected={gaugeId === g.id}
                  onClick={() => { setGaugeId(g.id); setTimeout(goNext, 250); }}
                >
                  <span className="mb-1 block font-display text-sm font-semibold text-brand-white">
                    {g.name}
                  </span>
                  <div className="mb-2 text-xs text-brand-accent-light">{g.range}</div>
                  <p className="mb-1 text-[11px] text-brand-grey">{g.description}</p>
                  <span className="text-[10px] text-brand-grey">{dict.weightLabel} {g.weight}</span>
                </SelectionCard>
              ))}
            </div>
          </motion.div>
        )}

        {/* ───── Step 3: Result ───── */}
        {step === 3 && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="mb-1 font-display text-lg font-semibold text-brand-white">
              {dict.resultTitle}
            </h3>
            <p className="mb-6 text-sm text-brand-grey">
              {dict.resultDesc}
            </p>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Preview */}
              <div className="relative aspect-square overflow-hidden rounded-xl border border-white/5 bg-brand-dark">
                <FabricPreview
                  techniqueId={techniqueId!}
                  gaugeId={gaugeId!}
                  yarnColor={selectedYarn?.color ?? '#C9A84C'}
                />
                <div className="absolute bottom-3 left-3 rounded-full bg-brand-dark/80 px-3 py-1 text-xs text-brand-accent-light backdrop-blur-sm">
                  {result.name}
                </div>
              </div>

              {/* Info */}
              <div className="flex flex-col gap-5">
                <div>
                  <h4 className="mb-1 font-display text-xl font-bold text-brand-white">
                    {result.name}
                  </h4>
                  <p className="text-sm text-brand-grey">
                    {result.feel} · {result.weight}
                  </p>
                </div>

                <div>
                  <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-brand-grey">
                    {dict.bestFor}
                  </span>
                  <p className="text-sm text-brand-white">{result.bestFor}</p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {result.characteristics.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-brand-accent/20 bg-brand-accent/5 px-3 py-1 text-xs text-brand-accent-light"
                    >
                      {c}
                    </span>
                  ))}
                </div>

                <div className="space-y-3 rounded-xl border border-white/5 bg-brand-dark-2 p-4">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-brand-grey">
                    {dict.performance}
                  </span>
                  <StatBar label={dict.stats.stretchH} value={result.stretchH} />
                  <StatBar label={dict.stats.stretchV} value={result.stretchV} />
                  <StatBar label={dict.stats.warmth} value={result.warmth} />
                  <StatBar label={dict.stats.breathability} value={result.breathability} />
                  <StatBar label={dict.stats.durability} value={result.durability} />
                </div>

                <button
                  onClick={() => {
                    setStep(0);
                    setYarnId(null);
                    setTechniqueId(null);
                    setGaugeId(null);
                  }}
                  className="self-start rounded-full border border-white/10 px-5 py-2 text-xs font-medium text-brand-grey transition-colors hover:text-brand-white"
                >
                  {dict.startOver}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
