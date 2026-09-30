import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import { site } from '@/lib/site';
export const metadata: Metadata = { title: 'Kontakt', alternates: { canonical: '/kontakt' } };
export default function Contact() { return <><div className="page-hero shell"><p className="eyebrow">KONTAKT</p><h1>Berätta vad ni<br/><em>vill skapa.</em></h1><p className="lead">En idé eller en fråga? Vi lyssnar.</p></div><section className="section shell contact-layout"><div><p className="eyebrow">SKRIV TILL OSS</p><h2>Vi lyssnar.</h2><p>Skriv direkt eller använd formuläret.</p><a className="inline-link" href={`mailto:${site.email}`}>{site.email} ↗</a></div><ContactForm/></section></>; }
