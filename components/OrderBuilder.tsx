'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { packages, addons, money } from '@/lib/site';
import { orderSchema, type OrderValues } from '@/lib/schemas';
import { InquiryFields } from './InquiryFields';
export function OrderBuilder() {
  const [result, setResult] = useState('');
  const [sent, setSent] = useState(false);
  const { register, setValue, watch, handleSubmit, formState: { errors, isSubmitting } } = useForm<OrderValues>({ resolver: zodResolver(orderSchema), defaultValues: { packageId: 'standard', addons: [], consent: false as true } });
  const selected = watch('packageId'); const selectedAddons = watch('addons') || [];
  const pack = packages.find(p => p.id === selected) || packages[1];
  const total = pack.price + addons.filter(a => selectedAddons.includes(a.id)).reduce((sum, a) => sum + a.price, 0);
  const submit = handleSubmit(async values => {
    setResult('');
    try {
      const response = await fetch('/api/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
      const data = await response.json() as { success?: boolean; message: string; error?: string };
      if (!response.ok || !data.success) throw new Error(data.error || 'Mejlet kunde inte skickas. Försök igen.');
      setResult(data.message);
      setSent(true);
    } catch (error) {
      setResult(error instanceof Error ? error.message : 'Mejlet kunde inte skickas. Försök igen eller kontakta oss via e-post.');
    }
  });
  return <form onSubmit={submit} noValidate className="order-layout"><div className="order-main"><section aria-labelledby="package-title"><p className="eyebrow">STEG 01 / GRUNDEN</p><h2 id="package-title">Välj paket</h2><p className="subcopy">Priserna är vägledande exklusive moms. Slutlig offert tas fram efter samtal.</p><div className="package-grid">{packages.map(p => <label key={p.id} className={`package-card ${selected === p.id ? 'selected' : ''}`}><input type="radio" value={p.id} {...register('packageId')} /><span className="package-top"><strong>{p.name}</strong><span>{selected === p.id ? 'Valt' : 'Välj'}</span></span><span className="package-price">{money(p.price)}</span><span className="package-intro">{p.intro}</span><span className="package-features">{p.features.map(f => <span key={f}>✓ {f}</span>)}</span></label>)}</div></section><section aria-labelledby="addons-title"><p className="eyebrow">STEG 02 / FINSLIPNING</p><h2 id="addons-title">Lägg till det ni behöver</h2><div className="addon-list">{addons.map(a => <label key={a.id} className="addon-row"><input type="checkbox" checked={selectedAddons.includes(a.id)} onChange={e => setValue('addons', e.target.checked ? [...selectedAddons, a.id] : selectedAddons.filter(id => id !== a.id), { shouldValidate: true })}/><span><strong>{a.name}</strong><small>{a.detail}</small></span><b>+ {money(a.price)}</b></label>)}</div></section><section aria-labelledby="details-title"><p className="eyebrow">STEG 03 / KONTAKT</p><h2 id="details-title">Berätta om ert företag</h2><p className="subcopy">Vi använder uppgifterna för att förstå projektet och återkomma med en offert via e-post.</p><InquiryFields register={register} errors={errors}/><button className="button" disabled={isSubmitting || sent} type="submit">{isSubmitting ? 'Skickar…' : sent ? 'Skickat' : 'Skicka beställningsförfrågan'} <span aria-hidden="true">↗</span></button><p className="form-note">Förfrågan skickas till conect.webbsmedjan@gmail.com. Ingen betalning genomförs.</p><p className="form-status" role="status">{result}</p></section></div><aside className="order-summary" aria-label="Ordersammanfattning"><p className="eyebrow">ER SAMMANFATTNING</p><h3>Det här ingår</h3><div className="summary-row"><span>{pack.name}</span><strong>{money(pack.price)}</strong></div>{addons.filter(a => selectedAddons.includes(a.id)).map(a => <div className="summary-row" key={a.id}><span>{a.name}</span><strong>{money(a.price)}</strong></div>)}<div className="summary-total"><span>Uppskattat pris</span><strong>{money(total)}</strong></div><p>Exklusive moms. Detta är en förfrågan, ingen bindande beställning.</p></aside></form>;
}
