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

- `app/`: sidor, metadata, sitemap, robots och formulär-API.
- `components/`: navigation, cookieval, formulär och orderbyggare.
- `lib/`: gemensamt innehåll, priser och zod-scheman.
- `public/`: favicon och Open Graph-bild.

Kontakt och beställning skickas via Cloudflares `INQUIRY_EMAIL`-binding till `conect.webbsmedjan@gmail.com`. Avsändaren är `formular@webbsmedjan.com`, och Reply-To är besökarens adress. Beställningsmejlet innehåller referens, kontaktuppgifter, paket, tillval, serverberäknat pris och projektbeskrivning i text och HTML. Kvittens visas först efter lyckad överlämning till Cloudflare. Email Routing måste vara aktiverat för webbsmedjan.com och Gmail-adressen verifierad. `cloudflare-bindings.json` används av Vite-bygget och innehåller mottagarbegränsning samt en gräns på fem förfrågningar per minut och IP. Lokalt simulerar Wrangler leveransen och sparar mejlen under `.wrangler/`; inga verkliga mejl skickas. Kör `node node_modules/wrangler/bin/wrangler.js types worker-configuration.d.ts --config cloudflare-bindings.json` efter ändrade bindings. `npm.cmd run verify:email` testar innehåll, validering och leveransfel utan riktiga utskick. Fullständiga företagsuppgifter och fastställda juridiska villkor behöver kompletteras. Produktionsbygget tillåter indexering; sätt `NEXT_PUBLIC_SITE_INDEXABLE=false` om en förhandsversion inte ska hittas av sökmotorer. `https://webbsmedjan.com` används som standard för sitemap, canonical och metadata. Sätt `NEXT_PUBLIC_SITE_URL` om adressen ändras.

Den äldre statiska versionen finns kvar i `src/`, `build.mjs` och `dist/` som referens. Next.js använder inte dem.

## Säkerhetskontroller

Se `SECURITY-REVIEW.md` för fynd, åtgärder och avgränsningar. `npm.cmd run verify:security` testar CSP, säkerhetshuvuden, cookiepanelen och formulärens felåterhämtning med simulerade API-svar. Använd lokal server; testerna skickar inga riktiga mejl. `npm.cmd audit` kontrollerar kända paketsårbarheter. Checka in och använd `package-lock.json` vid reproducerbara byggen.

`middleware.ts` sätter en unik CSP-nonce för varje svar. `next.config.ts` och `public/_headers` skyddar dokument och statiska filer. Cloudflare har Always Use HTTPS aktiverat och lägsta TLS 1.2. Zods JIT är avstängd för att valideringen ska fungera utan eval i produktion. Formulär-API kräver samma Origin och JSON samt avbryter kroppar över 24 000 byte.

## Design och 3D

app/atelier.css innehåller den aktiva färg- och typografiförfiningen. Barlow Condensed och Manrope självhostas genom Fontsource. ForgeSculpture laddar Three.js nära vyn och återanvänder samma komponentkontroller för dator/mobil. Kör npm.cmd run verify:design med servern igång för autostart, verklig WebGL-rendering, materialbyte, rotation, minskad rörelse, reservläge, axe och CSP. Skärmbilder sparas under qa/atelier/.
