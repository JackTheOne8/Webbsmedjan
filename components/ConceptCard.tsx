import Image from 'next/image';
import Link from 'next/link';
import type { concepts } from '@/lib/concepts';

type Concept = (typeof concepts)[number];

export function ConceptCard({ concept, detailed = false }: { concept: Concept; detailed?: boolean }) {
  const content = <>
      <div className="concept-preview">
        {concept.image && <Image src={concept.image} alt={concept.imageAlt} fill loading="eager" sizes="(max-width: 760px) 100vw, 50vw"/>}
        <div className="concept-ui" aria-hidden="true">
          <div className="concept-nav"><b>{concept.name}</b><span>OM OSS&nbsp;&nbsp; / &nbsp;&nbsp;UTFORSKA&nbsp; ↗</span></div>
          <div className="concept-hero-copy"><small>{concept.category}</small><strong>{concept.heading}</strong><span className="concept-faux-button">Utforska <span>↗</span></span></div>
          {concept.theme === 'studio' && <div className="studio-form"><i/><i/><i/></div>}
          <div className="concept-bottom"><span>EN IDÉ FRÅN WEBBSMEDJAN</span><span>{concept.number} / 03</span></div>
        </div>
      </div>
      <div className="concept-meta"><div><span>{concept.number} / {concept.category}</span><h3>{concept.name}</h3><p>{concept.description}</p></div>{!detailed && <span className="concept-arrow" aria-hidden="true">↗</span>}</div>
  </>;
  return <article className={`concept-card concept-${concept.theme}`} id={detailed ? concept.id : undefined}>
    {detailed ? <>{content}<Link href="/bestall" className="concept-detail-link">Starta ett liknande projekt <span aria-hidden="true">↗</span></Link></> : <Link href={`/referenser#${concept.id}`} className="concept-link" aria-label={`Se konceptet ${concept.name}`}>{content}</Link>}
  </article>;
}
