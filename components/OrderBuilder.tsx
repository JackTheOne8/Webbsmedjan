'use client';
import { Icon } from '@/components/Icon';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { packages, addons, money, priceFor, site } from '@/lib/site';
import { orderSchema, type OrderValues } from '@/lib/schemas';
import { useHydratedReducedMotion } from '@/lib/use-hydrated-reduced-motion';
import { InquiryFields } from './InquiryFields';
import { sendInquiry } from '@/lib/send-inquiry';

export function OrderBuilder() {
  const [result, setResult] = useState('');
  const [sent, setSent] = useState(false);
  const reduceMotion = useHydratedReducedMotion();
  const { register, setValue, watch, handleSubmit, formState: { errors, isSubmitting } } = useForm<OrderValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: { isUf: false, packageId: 'bas', addons: [], consent: false as true },
  });
  const isUf = watch('isUf') === true;
  const selected = watch('packageId');
  const selectedAddons = watch('addons') || [];
  const pack = packages.find(item => item.id === selected) || packages[0];
  const chosen = addons.filter(item => selectedAddons.includes(item.id));
  const total = priceFor(pack, isUf) + chosen.reduce((sum, item) => sum + priceFor(item, isUf), 0);
  const busy = isSubmitting || sent;
  const submit = handleSubmit(async values => {
    setResult('');
    try {
      setResult(await sendInquiry('order', values));
      setSent(true);
    } catch (error) {
      setResult(error instanceof Error ? error.message : `Försök igen eller mejla ${site.email}.`);
    }
  });
  const price = (item: typeof packages[number] | typeof addons[number]) => (
    <motion.span key={isUf ? 'uf' : 'company'} initial={reduceMotion ? false : { opacity: .65, y: 3 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .18 }}>
      {money(priceFor(item, isUf))}
    </motion.span>
  );

  return <form onSubmit={submit} noValidate className="order-layout order-builder" aria-busy={isSubmitting}>
    <fieldset className="order-main" disabled={busy}>
      <legend className="sr-only">Bygg er beställningsförfrågan</legend>
      <div className={`customer-choice ${isUf ? 'is-uf' : ''}`}>
        <div><p className="eyebrow">FÖR ER VERKSAMHET</p><h2>{isUf ? 'Liten start. Stora idéer.' : 'En webbplats att växa med.'}</h2></div>
        <div className="uf-option">
          <label id="uf-label" htmlFor="uf-switch">Vi är ett UF-företag</label>
          <button id="uf-switch" type="button" role="switch" aria-checked={isUf} aria-labelledby="uf-label" aria-describedby="uf-price-note" className="uf-switch" onClick={() => setValue('isUf', !isUf, { shouldDirty: true })}>
            <span className="uf-switch-track"><motion.span className="uf-switch-thumb" initial={false} animate={{ x: isUf ? 24 : 0 }} transition={reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 32 }}><span aria-hidden="true">{isUf && <Icon name="check"/>}</span></motion.span></span>
          </button>
          <span id="uf-price-note">{isUf ? 'UF-priser från 350 kr' : 'Företagspriser från 2 000 kr'}</span>
        </div>
      </div>
      <section aria-labelledby="package-title">
        <div className="order-step-heading"><p className="eyebrow">01 / PAKET</p><h2 id="package-title">Välj er grund.</h2></div>
        <p className="package-common">Mobilanpassad design och grundläggande SEO ingår alltid.</p>
        <div className="package-grid">{packages.map(item => <label key={item.id} className={`package-card ${selected === item.id ? 'selected' : ''}`}>
          <input type="radio" value={item.id} {...register('packageId')}/>
          <span className="package-top"><strong>{item.name}</strong><span className="package-selection" aria-hidden="true"><Icon name={selected === item.id ? 'check' : 'plus'}/></span></span>
          <span className="package-price">{price(item)}</span>
          <span className="package-features">{item.features.map(feature => <span key={feature}>{feature}</span>)}</span>
        </label>)}</div>
      </section>
      <section aria-labelledby="addons-title">
        <div className="order-step-heading"><p className="eyebrow">02 / TILLVAL</p><h2 id="addons-title">Det lilla extra.</h2></div>
        <div className="addon-list">{addons.map(item => <label key={item.id} className={`addon-row ${selectedAddons.includes(item.id) ? 'is-selected' : ''}`}>
          <input type="checkbox" checked={selectedAddons.includes(item.id)} onChange={event => setValue('addons', event.target.checked ? [...selectedAddons, item.id] : selectedAddons.filter(id => id !== item.id), { shouldValidate: true, shouldDirty: true })}/>
          <span><strong>{item.name}</strong><small>{item.detail}</small></span><b>+ {price(item)}</b>
        </label>)}</div>
      </section>
      <section aria-labelledby="details-title">
        <div className="order-step-heading"><p className="eyebrow">03 / KONTAKT</p><h2 id="details-title">Berätta om er.</h2></div>
        <InquiryFields register={register} errors={errors}/>
        <div className="order-submit-row"><button className="button" disabled={busy} type="submit">{isSubmitting ? 'Skickar…' : sent ? 'Skickat' : 'Skicka beställningsförfrågan'} <span aria-hidden="true"><Icon name="arrow-up-right"/></span></button><span>{money(total)} <small>exkl. moms</small></span></div>
        <p className="form-note">Ingen betalning nu. Vi återkommer med en offert.</p>
      </section>
    </fieldset>
    <aside className="order-summary" aria-label="Ordersammanfattning">
      <p className="eyebrow">ER WEBBPLATS</p><span className="summary-customer">{isUf ? 'UF-företag' : 'Företag'}</span>
      <h3>{pack.name}</h3>
      <div className="summary-row"><span>Grundpaket</span><strong>{money(priceFor(pack, isUf))}</strong></div>
      {chosen.map(item => <div className="summary-row" key={item.id}><span>{item.name}</span><strong>{money(priceFor(item, isUf))}</strong></div>)}
      <div className="summary-total" role="status" aria-live="polite" aria-atomic="true"><span>Uppskattat pris</span><strong>{money(total)}</strong></div>
      <p>Exkl. moms. Slutligt pris enligt offert.</p>
    </aside>
    <p className="form-status order-result" role="status">{result}</p>
  </form>;
}
