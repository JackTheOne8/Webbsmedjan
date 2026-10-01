import { Icon } from '@/components/Icon';
import Link from '@/components/SafeLink';
import { Reveal } from '@/components/Reveal';
import { ForgeVisual } from '@/components/ForgeVisual';
import { ForgeTimeline } from '@/components/ForgeTimeline';
import { ConceptCard } from '@/components/ConceptCard';
import { concepts } from '@/lib/concepts';

export default function Home() { return <div className="studio-home">
  <section className="studio-hero shell">
    <div className="studio-title"><h1>Vi smider webbplatser<br/><em>som gör intryck.</em></h1><p>Webbsmedjan UF<br/>Digitalt hantverk, på riktigt.</p></div>
    <div className="studio-film"><ForgeVisual/><div className="film-brief glass-panel"><p className="lead">Ert företag. <br/>Ett eget uttryck.</p><p>Webbplatser som gör er lätta att hitta och enkla att välja.</p><Link href="/bestall" className="button">Beställ webbsida <span aria-hidden="true"><Icon name="arrow-up-right"/></span></Link></div></div>
    <div className="hero-caption"><span>FRÅN FÖRSTA IDÉ TILL FÄRDIG WEBB</span><Link href="/tjanster">Utforska våra tjänster <span aria-hidden="true"><Icon name="arrow-up-right"/></span></Link></div>
  </section>
  <section className="section shell workshop-section" aria-labelledby="workshop-title">
    <Reveal><div className="workshop-intro"><h2 id="workshop-title">Form. Funktion.<br/><em>Och omtanke.</em></h2><p>Vi bygger, utvecklar och tar hand om er webbplats.</p></div></Reveal>
    <div className="workshop-list">
      <Link href="/tjanster" className="workshop-row"><div><h3>Företagswebbplatser</h3><p>En snabb, personlig webbplats för ert företag.</p></div><span aria-hidden="true"><Icon name="arrow-up-right"/></span></Link>
      <Link href="/tjanster" className="workshop-row"><div><h3>E-handel</h3><p>En butik som gör det enkelt att handla.</p></div><span aria-hidden="true"><Icon name="arrow-up-right"/></span></Link>
      <Link href="/tjanster" className="workshop-row"><div><h3>SEO & underhåll</h3><p>Bli hittade. Håll webbplatsen i form.</p></div><span aria-hidden="true"><Icon name="arrow-up-right"/></span></Link>
    </div>
  </section>
  <section className="section craft-section"><div className="shell">
    <Reveal><h2>Nära er.<br/><em>Noga med detaljerna.</em></h2></Reveal>
    <div className="craft-panel glass-panel"><article><h3>En kontakt hela vägen</h3><p>Nära dialog. Begripliga beslut.</p></article><article><h3>Form med en uppgift</h3><p>Hjälp besökaren att ta nästa steg.</p></article><article><h3>Byggd för att hålla</h3><p>Snabb, tillgänglig och enkel att utveckla.</p></article></div>
  </div></section>
  <section className="section shell inspiration-section">
    <Reveal><div className="concept-heading"><h2>Olika idéer.<br/><em>Egna uttryck.</em></h2><div><p>Två riktningar att inspireras av.<br/>Fiktiva koncept, inga kunduppdrag.</p><Link href="/referenser" className="inline-link">Se alla koncept <span aria-hidden="true"><Icon name="arrow-up-right"/></span></Link></div></div></Reveal>
    <div className="project-grid studio-projects">{concepts.slice(0, 2).map(concept => <Reveal key={concept.id}><ConceptCard concept={concept}/></Reveal>)}</div>
  </section>
  <section className="section process-section"><div className="shell"><Reveal><h2>En idé blir verklighet.<br/><em>Steg för steg.</em></h2></Reveal><ForgeTimeline/></div></section>
  </div>; }
