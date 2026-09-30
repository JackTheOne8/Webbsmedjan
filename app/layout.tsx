import type { Metadata } from 'next';
import './globals.css';
import './forge.css';
import '@fontsource/barlow-condensed/latin-700.css';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-700.css';
import './atelier.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CookieConsent } from '@/components/CookieConsent';
import { ScrollProgress } from '@/components/ScrollProgress';
import { site } from '@/lib/site';
export const metadata: Metadata = { metadataBase: new URL(site.url), alternates: { canonical: '/' }, title: { default: 'Webbsmedjan – webbplatser med hantverk och precision', template: '%s | Webbsmedjan' }, description: 'Webbsmedjan bygger genomtänkta webbplatser för svenska företag. Välj ett paket, forma er lösning och ta nästa steg.', openGraph: { title: 'Webbsmedjan', description: 'Webbplatser med hantverk och precision.', locale: 'sv_SE', type: 'website', images: ['/webbsmedjan-logo.jpeg'] }, icons: { icon: '/favicon.svg' }, robots: { index: site.indexable, follow: site.indexable }, verification: { google: 'XBvb7FFifeGG79XFUeob1Z30OvSId9YZn20jbQYQYgo' } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="sv"><body><a className="skip-link" href="#main">Hoppa till innehåll</a><ScrollProgress/><Header/><main id="main">{children}</main><Footer/><CookieConsent/></body></html>; }
