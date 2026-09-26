'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [['/tjanster', 'Tjänster'], ['/bestall', 'Beställ'], ['/referenser', 'Referenser'], ['/om-oss', 'Om oss'], ['/kontakt', 'Kontakt']] as const;
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="shell header-inner">
    <Link href="/" className="brand" aria-label="Webbsmedjan UF – startsida" onClick={() => setOpen(false)}><span className="brand-emblem" aria-hidden="true"><Image src="/webbsmedjan-logo.jpeg" alt="" width={1024} height={576} priority/></span><span className="brand-name">WEBBSMEDJAN <small>UF</small></span></Link>
    <button className="menu-toggle" type="button" aria-expanded={open} aria-controls="primary-nav" onClick={() => setOpen(!open)}>{open ? 'Stäng' : 'Meny'} <span aria-hidden="true">{open ? '×' : '☰'}</span></button>
    <nav id="primary-nav" className={open ? 'main-nav is-open' : 'main-nav'} aria-label="Huvudmeny">{links.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined} onClick={() => setOpen(false)}>{label}</Link>)}<Link href="/bestall" className="nav-cta" onClick={() => setOpen(false)}>Starta projekt <span aria-hidden="true">↗</span></Link></nav>
  </div></header>;
}
