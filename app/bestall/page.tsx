import type { Metadata } from 'next';
import { OrderBuilder } from '@/components/OrderBuilder';
export const metadata: Metadata = { title: 'Beställ webbsida', description: 'Välj paket och tillval och bygg en förfrågan till Webbsmedjan.', alternates: { canonical: '/bestall' } };
export default function Order() { return <><div className="page-hero shell order-hero"><p className="eyebrow">BESTÄLL WEBBSIDA</p><h1>Er nästa webbplats.<br/><em>På era villkor.</em></h1><p className="lead">Välj paket och tillval. Vi tar hand om resten.</p></div><div className="section shell order-section"><OrderBuilder/></div></>; }
