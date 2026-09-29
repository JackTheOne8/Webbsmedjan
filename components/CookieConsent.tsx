'use client';
import { useEffect, useState } from 'react';
import Link from '@/components/SafeLink';
type Choice = { necessary: true; statistics: boolean; marketing: boolean };
const key = 'webbsmedjan-cookie-choice-v1';
export function CookieConsent() {
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
  const save = (choice: Choice) => { localStorage.setItem(key, JSON.stringify(choice)); setStatistics(choice.statistics); setMarketing(choice.marketing); setOpen(false); };
  if (!open) return null;
  return <div className="cookie-backdrop"><section className="cookie-panel" role="region" aria-labelledby="cookie-title"><p className="eyebrow">DIN INTEGRITET</p><h2 id="cookie-title">Cookies, på dina villkor.</h2><p>Webbplatsen behöver nödvändig lokal lagring för att komma ihåg ditt val. Statistik och marknadsföring är avstängda tills du väljer dem. Läs vår <Link href="/cookies">cookiepolicy</Link>.</p>
    {details && <div className="cookie-options"><div><strong>Nödvändiga</strong><span>Alltid aktiva</span></div><label><span>Statistik<small>Hjälper oss förstå användningen om vi aktiverar statistik.</small></span><input type="checkbox" checked={statistics} onChange={e => setStatistics(e.target.checked)}/></label><label><span>Marknadsföring<small>För framtida marknadsföringstjänster.</small></span><input type="checkbox" checked={marketing} onChange={e => setMarketing(e.target.checked)}/></label></div>}
    <div className="cookie-actions"><button type="button" className="button" onClick={() => save({ necessary: true, statistics: true, marketing: true })}>Acceptera alla</button><button type="button" className="button button-secondary" onClick={() => save({ necessary: true, statistics: false, marketing: false })}>Endast nödvändiga</button>{details ? <button type="button" className="text-button" onClick={() => save({ necessary: true, statistics, marketing })}>Spara inställningar</button> : <button type="button" className="text-button" onClick={() => setDetails(true)}>Anpassa val</button>}</div>
  </section></div>;
}
