'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from '@/components/SafeLink';
type Choice = { necessary: true; statistics: boolean; marketing: boolean };
const key = 'webbsmedjan-cookie-choice-v1';
export function CookieConsent() {
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [statistics, setStatistics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const necessaryRef = useRef<HTMLButtonElement>(null);
  const save = useCallback((choice: Choice) => {
    // Some privacy modes deny storage. A choice must still close the panel.
    try { localStorage.setItem(key, JSON.stringify(choice)); } catch { /* Remember in this page session only. */ }
    setStatistics(choice.statistics); setMarketing(choice.marketing); setOpen(false);
  }, []);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      const choice: unknown = saved ? JSON.parse(saved) : null;
      if (choice && typeof choice === 'object' && 'necessary' in choice && choice.necessary === true && 'statistics' in choice && typeof choice.statistics === 'boolean' && 'marketing' in choice && typeof choice.marketing === 'boolean') {
        setStatistics(choice.statistics); setMarketing(choice.marketing);
      } else setOpen(true);
    } catch { setOpen(true); }
    const trigger = document.getElementById('cookie-settings-trigger');
    const show = () => { setDetails(true); setOpen(true); };
    trigger?.addEventListener('click', show);
    return () => trigger?.removeEventListener('click', show);
  }, []);
  useEffect(() => {
    if (!open) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    const background = [...document.querySelectorAll<HTMLElement>('main, header.site-header, footer, .skip-link')].map(element => ({ element, inert: element.inert }));
    for (const { element } of background) element.inert = true;
    document.body.style.overflow = 'hidden';
    necessaryRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault(); save({ necessary: true, statistics: false, marketing: false });
      }
      if (event.key !== 'Tab') return;
      const targets = [...(panelRef.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled])') || [])].filter(element => element.getClientRects().length);
      const first = targets[0], last = targets.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      for (const { element, inert } of background) element.inert = inert;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open, save]);
  if (!open) return null;
  return <div className="cookie-backdrop"><section ref={panelRef} className="cookie-panel" role="dialog" aria-modal="true" aria-labelledby="cookie-title"><p className="eyebrow">DIN INTEGRITET</p><h2 id="cookie-title">Cookies, på dina villkor.</h2><p>Webbplatsen behöver nödvändig lokal lagring för att komma ihåg ditt val. Statistik och marknadsföring är avstängda tills du väljer dem. Läs vår <Link href="/cookies">cookiepolicy</Link>.</p>
    {details && <div className="cookie-options"><div><strong>Nödvändiga</strong><span>Alltid aktiva</span></div><label><span>Statistik<small>Hjälper oss förstå användningen om vi aktiverar statistik.</small></span><input type="checkbox" checked={statistics} onChange={e => setStatistics(e.target.checked)}/></label><label><span>Marknadsföring<small>För framtida marknadsföringstjänster.</small></span><input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)}/></label></div>}
    <div className="cookie-actions"><button type="button" className="button" onClick={() => save({ necessary: true, statistics: true, marketing: true })}>Acceptera alla</button><button ref={necessaryRef} type="button" className="button button-secondary" onClick={() => save({ necessary: true, statistics: false, marketing: false })}>Endast nödvändiga</button>{details ? <button type="button" className="text-button" onClick={() => save({ necessary: true, statistics, marketing })}>Spara inställningar</button> : <button type="button" className="text-button" onClick={() => setDetails(true)}>Anpassa val</button>}</div>
  </section></div>;
}
