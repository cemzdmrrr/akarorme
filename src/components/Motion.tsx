'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, type Variant } from 'framer-motion';

/* ────────── Reusable reveal wrapper ────────── */
const hidden: Variant = { opacity: 0, y: 30 };
const visible: Variant = { opacity: 1, y: 0 };

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  once = true,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ hidden, visible }}
      transition={{ duration: 0.6, ease: [0.25, 0, 0.25, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ────────── Stagger children ────────── */
export function StaggerContainer({
  children,
  className,
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={{ hidden, visible }}
      transition={{ duration: 0.5, ease: [0.25, 0, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ────────── Animated counter ────────── */
export function AnimatedCounter({
  value,
  suffix = '',
  className,
}: {
  value: number;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !ref.current) return;
    let start = 0;
    const duration = 2000;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      if (ref.current) ref.current.textContent = Math.floor(value * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value, suffix]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}
