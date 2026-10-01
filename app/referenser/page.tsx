import { Icon } from '@/components/Icon';
import type { Metadata } from 'next';
import Link from '@/components/SafeLink';
import { ConceptCard } from '@/components/ConceptCard';
import { concepts } from '@/lib/concepts';
export const metadata: Metadata = { title: 'Referenser och koncept', alternates: { canonical: '/referenser' } };
export default function References() { return <><div className="page-hero shell"><p className="eyebrow">REFERENSER / KONCEPT</p><h1>Så kan en idé<br/><em>ta form.</em></h1><p className="lead">Tre fiktiva webbkoncept som visar hur olika företag kan få egna uttryck. De är inte genomförda kunduppdrag.</p></div><section className="section shell project-grid project-grid-all" aria-label="Webbkoncept">{concepts.map(concept => <ConceptCard key={concept.id} concept={concept} detailed/>)}</section><div className="shell page-end"><p>Har ni ett projekt vi kan forma tillsammans?</p><Link href="/bestall" className="button">Starta er förfrågan <span aria-hidden="true"><Icon name="arrow-up-right"/></span></Link></div></>; }
