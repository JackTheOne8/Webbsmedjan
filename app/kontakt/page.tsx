import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import { site } from '@/lib/site';
export const metadata: Metadata = { title: 'Kontakt', alternates: { canonical: '/kontakt' } };
export default function Contact() { return <><div className="page-hero shell"><p className="eyebrow">KONTAKT</p><h1>Berätta vad ni<br/><em>vill skapa.</em></h1><p className="lead">Ett första samtal är ofta det bästa sättet att hitta rätt väg. Beskriv er idé så tar vi den därifrån.</p></div><section className="section shell contact-layout"><div><p className="eyebrow">SKRIV TILL OSS</p><h2>Vi lyssnar.</h2><p>Har ni frågor om paket, tidsplan eller ett projekt som inte passar i en färdig mall? Hör av er.</p><a className="inline-link" href={`mailto:${site.email}`}>{site.email} ↗</a></div><ContactForm/></section></>; }
