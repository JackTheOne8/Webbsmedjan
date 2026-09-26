'use client';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useHydratedReducedMotion } from '@/lib/use-hydrated-reduced-motion';
import { useRef } from 'react';

export function ForgeVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [38, -38]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-5, 3]);
  return <div className="hero-art" ref={ref}>
    <div className="forge-halo" aria-hidden="true"/>
    <div className="forge-orbit forge-orbit-one" aria-hidden="true"/>
    <div className="forge-orbit forge-orbit-two" aria-hidden="true"/>
    <div className="forge-coordinate coordinate-top" aria-hidden="true">FIG. 01 / DIGITALT HANTVERK</div>
    <div className="logo-plate-position"><motion.div className="logo-plate" style={reduce ? undefined : { y, rotate }}>
      <Image src="/webbsmedjan-logo.jpeg" alt="Webbsmedjan UF:s logotyp: en laptop, hammare och städ" width={1024} height={576} priority sizes="(max-width: 760px) 84vw, 42vw"/>
    </motion.div></div>
    <div className="forge-coordinate coordinate-bottom" aria-hidden="true"><span>FORMAD FÖR ER</span><span>◦</span><span>BYGGD FÖR FRAMTIDEN</span></div>
  </div>;
}
