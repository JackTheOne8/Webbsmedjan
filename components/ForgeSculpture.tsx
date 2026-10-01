'use client';
import { useEffect, useRef, useState } from 'react';
import Link from '@/components/SafeLink';
import { useHydratedReducedMotion } from '@/lib/use-hydrated-reduced-motion';
import type { ForgeMotion, ForgeScene } from '@/lib/forge-scene';

export function ForgeSculpture() {
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<ForgeScene | null>(null);
  const reduce = useHydratedReducedMotion();
  const [rotating, setRotating] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [copper, setCopper] = useState(false);
  const [status, setStatus] = useState<'loading' | 'ready' | 'fallback'>('loading');
  const motionRef = useRef<ForgeMotion>({ rotating, reduce: !!reduce, expanded });
  useEffect(() => { motionRef.current = { rotating, reduce: !!reduce, expanded }; }, [rotating, reduce, expanded]);
  useEffect(() => { if (reduce) setRotating(false); }, [reduce]);
  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let disposed = false, started = false, visible = false;
    async function start() {
      try {
        const { createForgeScene } = await import('@/lib/forge-scene');
        if (disposed) return;
        const scene = await createForgeScene(host!, () => motionRef.current, () => { if (!disposed) setStatus('fallback'); });
        if (disposed) scene.dispose();
        else { sceneRef.current = scene; scene.setVisible(visible); setStatus('ready'); }
      } catch { if (!disposed) setStatus('fallback'); }
    }
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      sceneRef.current?.setVisible(visible);
      if (visible && !started) { started = true; void start(); }
    }, { rootMargin: '180px' });
    observer.observe(host);
    return () => { disposed = true; observer.disconnect(); sceneRef.current?.dispose(); sceneRef.current = null; };
  }, []);
  return <article className="sculpture-showcase" aria-labelledby="sculpture-title">
    <div className="sculpture-copy"><span className="showcase-tag">INTERAKTIVT KONCEPT</span><h3 id="sculpture-title">Digitalt.<br/><em>Med en ny dimension.</em></h3><p>En idé behöver inte vara platt. Utforska form, ljus och rörelse.</p><Link href="/bestall" className="inline-link">Skapa något eget <span aria-hidden="true">↗</span></Link></div>
    <div className="sculpture-stage">
      <div className="sculpture-topline"><span>SMIDD I DIGITALT STÅL</span><span>3D / LIVE</span></div>
      <div ref={hostRef} className="sculpture-canvas" data-status={status} aria-hidden="true"/>
      {status !== 'ready' && <div className="sculpture-placeholder" role="status">{status === 'loading' ? 'Laddar 3D-koncept…' : '3D-visningen stöds inte av din webbläsare.'}</div>}
      <div className="sculpture-bottom"><p>{status === 'ready' ? 'Rör musen över formen. Dra för att rotera.' : 'Form · ljus · rörelse'}</p><div className="sculpture-controls" aria-label="Styr 3D-objektet">
        <button type="button" disabled={status !== 'ready'} aria-label="Rotera åt vänster" onClick={() => sceneRef.current?.turn(-.35)}>←</button>
        <button type="button" disabled={status !== 'ready'} aria-label="Rotera åt höger" onClick={() => sceneRef.current?.turn(.35)}>→</button>
        <button type="button" disabled={status !== 'ready'} aria-pressed={expanded} onClick={() => setExpanded(!expanded)}>{expanded ? 'Samla' : 'Explodera'}</button>
        <button type="button" disabled={status !== 'ready'} aria-pressed={copper} onClick={() => { setCopper(!copper); sceneRef.current?.material(!copper); }}>{copper ? 'Koppar' : 'Stål'}</button>
        <button type="button" disabled={status !== 'ready'} aria-pressed={rotating} onClick={() => setRotating(!rotating)}>{rotating ? 'Pausa' : 'Rotera'}</button>
        <button type="button" disabled={status !== 'ready'} onClick={() => { setExpanded(false); sceneRef.current?.reset(); }}>Återställ</button>
      </div></div>
    </div>
  </article>;
}
