import type { Metadata } from 'next';
import { OrderBuilder } from '@/components/OrderBuilder';
export const metadata: Metadata = { title: 'Beställ webbsida', description: 'Välj paket och tillval och bygg en förfrågan till Webbsmedjan.', alternates: { canonical: '/bestall' } };
export default function Order() { return <><div className="page-hero shell"><p className="eyebrow">BESTÄLL / BYGG ER LÖSNING</p><h1>Välj delarna.<br/><em>Vi smider helheten.</em></h1><p className="lead">Välj ett startpaket, lägg till det ni behöver och berätta om ert företag. Ni får en tydlig överblick innan ni skickar er förfrågan.</p></div><div className="section shell"><OrderBuilder/></div></>; }
