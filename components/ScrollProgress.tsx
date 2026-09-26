'use client';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useHydratedReducedMotion } from '@/lib/use-hydrated-reduced-motion';
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const spring = useSpring(scrollYProgress, { stiffness: 190, damping: 34, mass: 0.25 });
  const reduce = useHydratedReducedMotion();
  return <motion.div className="scroll-progress" aria-hidden="true" style={{ scaleX: reduce ? scrollYProgress : spring }}/>;
}
