export const site = {
  name: 'Webbsmedjan',
  url: process.env.NEXT_PUBLIC_SITE_URL || (process.env.NODE_ENV === 'production' ? 'https://webbsmedjan.com' : 'http://localhost:4180'),
  email: 'conect.webbsmedjan@gmail.com',
  // Public production builds are crawlable; set the variable to "false" for previews.
  indexable: process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_SITE_INDEXABLE !== 'false',
};

export const packages = [
  { id: 'bas', name: 'Bas', price: 2000, ufPrice: 350, features: ['Upp till 3 sidor', 'Kontaktformulär'] },
  { id: 'standard', name: 'Standard', price: 4000, ufPrice: 700, features: ['Upp till 7 sidor', 'Personlig design'] },
  { id: 'premium', name: 'Premium', price: 6500, ufPrice: 1200, features: ['Upp till 12 sidor', 'Innehållsstöd'] },
] as const;

export const addons = [
  { id: 'extra', name: 'Extra sida', price: 400, ufPrice: 75, detail: 'Plats för mer innehåll.' },
  { id: 'seo', name: 'SEO-fördjupning', price: 600, ufPrice: 125, detail: 'Sökord och sidtitlar.' },
  { id: 'copy', name: 'Textstöd', price: 500, ufPrice: 100, detail: 'Hjälp med era texter.' },
  { id: 'animation', name: 'Animationer', price: 600, ufPrice: 150, detail: 'Rörelse, hover och scroll.' },
  { id: 'care', name: 'Underhåll, första året', price: 1200, ufPrice: 250, detail: 'Uppdateringar och tillsyn.' },
] as const;

export const priceFor = (item: { price: number; ufPrice: number }, isUf = false) => isUf ? item.ufPrice : item.price;

export const money = (value: number) => new Intl.NumberFormat('sv-SE').format(value) + ' kr';
