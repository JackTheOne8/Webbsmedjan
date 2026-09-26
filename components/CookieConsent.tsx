'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
type Choice = { necessary: true; statistics: boolean; marketing: boolean };
const key = 'webbsmedjan-cookie-choice-v1';
export function CookieConsent() {
  const panel = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [statistics, setStatistics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  useEffect(() => {
    try { const saved = localStorage.getItem(key); if (!saved) setOpen(true); else { const choice: Choice = JSON.parse(saved); setStatistics(!!choice.statistics); setMarketing(!!choice.marketing); } } catch { setOpen(true); }
    const trigger = document.getElementById('cookie-settings-trigger');
    const show = () => { setDetails(true); setOpen(true); };
    trigger?.addEventListener('click', show);
    return () => trigger?.removeEventListener('click', show);
  }, []);
  useEffect(() => {
    if (!open) return;
    panel.current?.querySelector<HTMLButtonElement>('button')?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;
      const focusable = Array.from(panel.current?.querySelectorAll<HTMLElement>('button, a, input') || []);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (!panel.current?.contains(document.activeElement)) { event.preventDefault(); first.focus(); return; }
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);
  const save = (choice: Choice) => { localStorage.setItem(key, JSON.stringify(choice)); setStatistics(choice.statistics); setMarketing(choice.marketing); setOpen(false); };
  if (!open) return null;
  return <div className="cookie-backdrop"><section ref={panel} className="cookie-panel" role="dialog" aria-modal="true" aria-labelledby="cookie-title"><p className="eyebrow">DIN INTEGRITET</p><h2 id="cookie-title">Cookies, på dina villkor.</h2><p>Webbplatsen behöver nödvändig lokal lagring för att komma ihåg ditt val. Statistik och marknadsföring är avstängda tills du väljer dem. Läs vår <Link href="/cookies">cookiepolicy</Link>.</p>
    {details && <div className="cookie-options"><div><strong>Nödvändiga</strong><span>Alltid aktiva</span></div><label><span>Statistik<small>Hjälper oss förstå användningen om vi aktiverar statistik.</small></span><input type="checkbox" checked={statistics} onChange={e => setStatistics(e.target.checked)}/></label><label><span>Marknadsföring<small>För framtida marknadsföringstjänster.</small></span><input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)}/></label></div>}
    <div className="cookie-actions"><button type="button" className="button" onClick={() => save({ necessary: true, statistics: true, marketing: true })}>Acceptera alla</button><button type="button" className="button button-secondary" onClick={() => save({ necessary: true, statistics: false, marketing: false })}>Endast nödvändiga</button>{details ? <button type="button" className="text-button" onClick={() => save({ necessary: true, statistics, marketing })}>Spara inställningar</button> : <button type="button" className="text-button" onClick={() => setDetails(true)}>Anpassa val</button>}</div>
  </section></div>;
}
