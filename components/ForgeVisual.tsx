'use client';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useHydratedReducedMotion } from '@/lib/use-hydrated-reduced-motion';
import { useRef } from 'react';

export function ForgeVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-18, 18]);
  return <div className="hero-art" ref={ref}>
    <motion.div className="hero-photo" style={reduce ? undefined : { y }}>
      <Image src="/forge-hero.webp" alt="En glödande skiva formas på ett städ i Webbsmedjans digitala smedja" fill preload sizes="(max-width: 760px) 100vw, 46vw"/>
    </motion.div>
    <div className="hero-art-top" aria-hidden="true"><span>WEBBSMEDJAN / VERKSTADEN</span><span>FORM / FUNKTION</span></div>
    <div className="hero-art-bottom" aria-hidden="true"><span>FRÅN FÖRSTA GNISTA</span><strong>TILL FÄRDIG WEBB.</strong></div>
  </div>;
}
