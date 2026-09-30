# Säkerhets- och bugggranskning – Webbsmedjan

Datum: 2026-09-30. Omfattning: GitHub-repot JackTheOne8/Webbsmedjan, produktionsbygget för Cloudflare Workers, webbsmedjan.com och www-omdirigeringen.

## Resultat

Granskningen hittade kända sårbara beroenden, uteblivet HTTPS-tvång, saknade säkerhetshuvuden och flera konkreta robusthetsfel. Dessa har rättats. Slutlig npm-kontroll visar **0 kända sårbarheter**, jämfört med **11 berörda paket före ändringen** (10 high, 1 low). Paketantalet är inte samma sak som antalet oberoende exploaterbara fel; flera poster gäller samma beroendekedja och utvecklingsverktyg.

Ingen belastningsattack eller verklig mejlleverans har genomförts. Formulärens positiva och negativa leveransvägar testas med simulerad leverans.

## Fynd och åtgärder

| Fynd | Bedömning | Åtgärd / verifiering |
| --- | --- | --- |
| Sårbara npm-paket, inklusive react-server-dom-webpack och Vinexts beroenden | Hög enligt npm; exploatering har inte försökts | Uppdaterade kompatibla versioner. React/RSC 19.3.0, Vinext 1.0.0, Vite 8.3.1, Wrangler 4.145.0, Cloudflare Vite-plugin 1.62.3. fflate låst till korrigerad patch 0.7.5. Nya versioner anges som minimum i package.json och låsfilen uppdaterades. npm audit: 0. |
| HTTP gav 200 utan omdirigering; Cloudflare tillät TLS 1.0 | Hög för formulärens transport | Always Use HTTPS aktiverat och lägsta TLS satt till 1.2 i Cloudflare. HTTP till /kontakt?test=https gav därefter 301 till HTTPS med bevarad sökväg och query. Middleware ger också 308 för huvuddomänens HTTP-sidor. |
| CSP, HSTS, ramningsskydd och MIME-skydd saknades | Medel | CSP med slumpmässig nonce per svar, script-src utan unsafe-inline/unsafe-eval i produktion, object-src/base-uri/frame-ancestors none. HSTS, X-Frame-Options DENY, nosniff, referrer- och permissions-policy. Dokument med nonce har no-store; hashade statiska filer behåller immutable cache. |
| Vildkortet för next.config-huvuden missade startsidan i Vinext | Medel | Explicit regel för / utöver /:path*. Browser-test verifierar huvuden på startsidan. Statiska filer har separat public/_headers. |
| Hela JSON-kroppen lästes innan storleksgränsen kontrollerades | Medel | Strömmen avbryts direkt efter 24 000 byte. Lokalt test visar att en lång chunkad kropp avbryts tidigt, utan mejl. |
| Saknad Origin accepterades; Content-Type godkändes via substring | Låg / förstärkt missbruksskydd | Kräver samma Origin, nekar Sec-Fetch-Site cross-site och matchar application/json som fullständig mediatyp. Saknad/felaktig Origin ger 403; falsk JSON-mediatyp ger 415. API-svar har no-store. |
| Saknad edge-IP hoppade över utskicksbegränsningen | Låg, defensiv korrigering | Gemensam begränsad reservnyckel används när CF-Connecting-IP saknas. Produktion använder Cloudflares IP-header. Test verifierar 429 och Retry-After. |
| Cookiepanelen kunde låsas om localStorage.setItem kastade; sparade strängar tolkades som samtycke | Bugg | Val sparas i aktuell sidvy även om lagring är blockerad. Sparade värden måste vara riktiga booleans. Felaktig data öppnar panelen med statistik/marknadsföring av. |
| Cookieöverlägget saknade fullständig modal tangentbordshantering | Tillgänglighetsbugg | Dialog med aria-modal, inert bakgrund, fokus inom dialogen, återställt fokus och Escape som väljer endast nödvändiga. Axe och tangentbordstest passerar. |
| Nätverksfel eller ett HTML-svar från API kunde visas som tekniska/engelska parserfel | Bugg | Gemensam sendInquiry-hjälpare ger svenska felmeddelanden, kontrollerar svarstyp och success, behåller uppgifter och tillåter nytt försök. Kontaktfält låses under utskick och efter bekräftad framgång. |
| Zods JIT försökte köra eval under strikt CSP | Bugg efter hårdningen | JIT avstängd i de gemensamma schemana. Valideringen fungerar med tolkad körning. Browser-test verifierar inga CSP-överträdelser under formulärflödet. |
| Videon kunde starta efter en tidig paus trots prefers-reduced-motion | Bugg | Autoplay avstängd vid minskad rörelse och sent play-event pausas, utom när besökaren uttryckligen startar videon. Testar paus samt manuellt play/pause på dator och mobil. |

React-advisory: [GHSA-wx67-qw84-cm4g](https://github.com/advisories/GHSA-wx67-qw84-cm4g). Korrigerade versionsgränser har kontrollerats mot npm:s aktuella advisory-data. CSP följer [Next.js vägledning för nonce](https://nextjs.org/docs/app/guides/content-security-policy). Inline style-attribut är uttryckligen tillåtna för React/Framer Motion; detta gäller inte scripts. Utvecklingsläget tillåter eval och WebSocket för byggverktygen, produktionen gör det inte.

## Kontroller som inte gav fynd

- Inga matchningar för privata nycklar eller vanliga riktiga API-tokenformat i 65 spårade filer och 7 tidigare commits. Skannern redovisar endast matchningsantal/filnamn, inga hemlighetsvärden. Detta är en mönsterskanning, inte bevis på att alla tänkbara hemlighetstyper saknas.
- /.env, /.git/config, /package.json, /cloudflare-bindings.json och /src/index.html gav 404 på live-sidan. GET /api/order gav 405.
- Inga publika uppladdningar, användarkonton, databasfrågor eller betalningsflöden finns i den aktiva appen.
- Paket/tillvals-ID, samtycke, fältlängder, e-postadress och honeypot valideras på servern. Okända värden och dubbla tillval nekas.
- Pris och mottagare beräknas på servern. Klientens manipulerade total och mottagaradress ignoreras.
- HTML i mejl escapades; CRLF i e-postadressen nekades. Meddelandet har fast avsändare/mottagare och besökarens validerade Reply-To.
- Leveransfel ger 503 utan falsk kvittens eller privata feluppgifter. Egna driftloggar innehåller endast referens och formulärtyp vid leveransfel.
- Navigation, 404, sitemap, robots, cookieval, UF-switch, animationstillval och svenska totalsummor fungerade i dator- och mobiltest.

## Kvarvarande begränsningar

1. **Spam från många IP-adresser:** fem giltiga förfrågningar per minut/IP och honeypot stoppar inte distribuerade botar. Ingen CAPTCHA/Turnstile är installerad. Det är ett offentligt kontaktformulär, och Origin är inte autentisering för en egen HTTP-klient.
2. **Ingen beständig idempotens:** ett nätverkssvar som försvinner efter accepterad mejlleverans kan leda till ett andra mejl vid manuell omsändning. Knappen stoppar normala upprepade klick, men servern garanterar inte exakt-en-gångleverans. Ingen betalning eller bindande beställning skapas av formuläret.
3. **Ofullständiga policyuppgifter:** integritetspolicy och villkor anger att företagsidentitet och fastställda lagringstider behöver kompletteras. Uppgifterna kan inte fyllas i utan riktiga företagsbeslut. Denna granskning intygar inte juridisk efterlevnad.
4. **Avgränsning:** inga kontoövertaganden, Gmail-kontots behörigheter eller Cloudflare-kontots MFA testades. Inga DoS-angrepp, skarpa spamutskick eller tester på fysiska telefoner utfördes. Äldre separat publicerad chatgpt.site-version omfattas inte av Cloudflare-deployen.

## Återkörbara kontroller

Med det byggda projektets lokala server på 127.0.0.1:4180:

```powershell
npm.cmd run check
npm.cmd run build
npm.cmd run start
# I en andra terminal:
npm.cmd run verify
$env:BASE_URL='http://127.0.0.1:4180'
npm.cmd run verify:links
npm.cmd run verify:email
npm.cmd run verify:security
npm.cmd audit
```

Browser-tester körs i Edge/Chromium på 1440 och 390 px. Säkerhetstesterna verifierar nonce-unikhet, script-noncer, inga CSP-överträdelser, cookies med blockerad/felaktig lagring, tangentbordsfokus, fel/återförsök och utskicksstate. Bilder och maskinrapporter sparas i ignorerad qa/. API-testerna använder simulerade Cloudflare-bindings.

Tre förbättringsomgångar: grundhårdning; korrigering av rotregel och CSP/JIT efter tester; videons minskade rörelse efter visuell kontroll. Konkreta fynd rättades och respektive kontroll kördes igen.
