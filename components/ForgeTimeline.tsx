'use client';
import { motion, useScroll, useSpring } from 'framer-motion';
import { useHydratedReducedMotion } from '@/lib/use-hydrated-reduced-motion';
import { useRef } from 'react';
const steps = [
  ['SAMTAL', 'Vi lyssnar', 'Ni berättar om verksamheten, målen och vad webbplatsen ska göra.'],
  ['FORM', 'Vi skissar', 'Vi hittar struktur, ton och ett uttryck som känns som ni.'],
  ['BYGGE', 'Vi smider', 'Vi bygger, testar och finslipar tills allt fungerar.'],
  ['LANSERING', 'Vi lämnar över', 'Ni får en färdig webbplats och vet hur ni tar den vidare.'],
];
export function ForgeTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useHydratedReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 35%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <div className="forge-timeline" ref={ref}>
    <div className="timeline-track" aria-hidden="true"><motion.span style={{ scaleX: reduce ? 1 : progress }}/></div>
    {steps.map(([label, title, detail], i) => <div className="timeline-step" key={label}>
      <span className="timeline-pin" aria-hidden="true"/>
      <span className="eyebrow">0{i + 1} / {label}</span><h3>{title}</h3><p>{detail}</p>
    </div>)}
  </div>;
}
