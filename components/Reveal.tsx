'use client';
import { motion } from 'framer-motion';
import { useHydratedReducedMotion } from '@/lib/use-hydrated-reduced-motion';
import type { ReactNode } from 'react';
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useHydratedReducedMotion();
  return <motion.div className={className} initial={reduce ? false : { opacity: 1, y: 42 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.16 }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div>;
}
