# Webbsmedjan

Svensk webbyråsajt byggd med Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, react-hook-form och zod.

## Lokalt

Kräver Node.js 22.13 eller senare.

```powershell
npm.cmd install
npm.cmd run dev
```

Öppna adressen som Vinext visar (normalt http://localhost:5173). `npm.cmd run build` skapar ett Cloudflare Workers-kompatibelt Sites-bygge. `npm.cmd run start` startar det med Wrangler lokalt.

`npm.cmd run check` kör TypeScript. Med servern igång kör `npm.cmd run verify` webbläsarkontroller och sparar bilder i `qa/next/`.

## Struktur

- `app/`: sidor, metadata, sitemap, robots och API-stubbar.
- `components/`: navigation, cookieval, formulär och orderbyggare.
- `lib/`: gemensamt innehåll, priser och zod-scheman.
- `public/`: favicon och Open Graph-bild.

Beställning och kontakt har avsiktligt API-stubbar. De validerar men skickar eller lagrar ingenting. Riktiga företagsuppgifter, färdiga juridiska texter, beslutad prislista samt e-postleverans med serverhemligheter och skydd mot missbruk behövs för att göra erbjudandet komplett. Produktionsbygget tillåter indexering; sätt `NEXT_PUBLIC_SITE_INDEXABLE=false` om en förhandsversion inte ska hittas av sökmotorer. `https://webbsmedjan.com` används som standard för sitemap, canonical och metadata. Sätt `NEXT_PUBLIC_SITE_URL` om adressen ändras.

Den äldre statiska versionen finns kvar i `src/`, `build.mjs` och `dist/` som referens. Next.js använder inte dem.
