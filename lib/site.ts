export const site = {
  name: 'Webbsmedjan',
  url: process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV === 'production' ? 'https://webbsmedjan.com' : 'http://localhost:4180'),
  email: 'conect.webbsmedjan@gmail.com',
  // Public production builds are crawlable; set the variable to "false" for previews.
  indexable: process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SITE_INDEXABLE !== 'false',
};

export const packages = [
  { id: 'bas', name: 'Bas', price: 9900, intro: 'En skarp start för ett mindre företag.', features: ['Upp till 3 sidor', 'Mobilanpassad design', 'Kontaktformulär', 'Grundläggande SEO'] },
  { id: 'standard', name: 'Standard', price: 19900, intro: 'Mer utrymme för er berättelse och era tjänster.', features: ['Upp till 7 sidor', 'Unik visuell riktning', 'Kontaktformulär', 'SEO och publiceringsstöd'] },
  { id: 'premium', name: 'Premium', price: 34900, intro: 'En större webbplats med fler möjligheter.', features: ['Upp till 12 sidor', 'Skräddarsydda sektioner', 'Innehållsstöd', 'SEO och överlämning'] },
] as const;

export const addons = [
  { id: 'extra', name: 'Extra sida', price: 1800, detail: 'För en tjänst eller ett innehåll som behöver egen plats.' },
  { id: 'seo', name: 'SEO-fördjupning', price: 3900, detail: 'Sökord, sidtitlar och innehållsstruktur.' },
  { id: 'copy', name: 'Textstöd', price: 4900, detail: 'Vi hjälper er formulera tydliga texter.' },
  { id: 'care', name: 'Underhåll, första året', price: 6900, detail: 'Löpande uppdateringar och teknisk tillsyn.' },
] as const;

export const money = (value: number) => new Intl.NumberFormat('sv-SE').format(value) + ' kr';
