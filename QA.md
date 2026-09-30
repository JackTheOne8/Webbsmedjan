# Webbsmedjan UF – QA

Datum: 2026-09-14. Tre genomförda förbättringsomgångar. Kontrollerna kördes lokalt i Edge via Playwright; ingen extern publicering eller verklig mejlleverans har gjorts.

## Omgång 1 – fungerande helhet

Byggde separat JavaScript-projekt, HTML-komponenter, original­logga, fem tjänster, tre konceptprojekt, process, AI-flöde, om oss, kontakt, integritetsutkast och 404. Skapade egen GLB-laptop, lazy-loadad Three.js-scen, GSAP-styrd öppning och kameraförflyttning. CSS-laptop ger ett oberoende alternativ.

Inspekterade dator, mobil och scrollsteg. Fynd: laptopens reflektioner var för ljusa; surfplattans höga och smala vy klippte laptopen och lade den över text. Testets bildkontroll förväntade sig felaktigt att en ännu inte synlig lazy-loadad bild var laddad; korrigerade kontrollen.

## Omgång 2 – responsivitet och rörelse

Flyttade gränsen för den statiska layouten till 1023 px. Mörkare material och ljus. GSAP scrub 0,35 s gav ungefär 30 uppdateringar mellan testade scrollpositioner i stället för ett direkt hopp. Ingen renderingsuppdatering efter att rörelsen stannat.

Sex lägen kontrollerades: 1440×1000, 390×844, 320×740, 768×1024, 844×390 samt 1440×1000 med minskad rörelse. Samtliga hade 0 px horisontellt överflöde, en h1, fem tjänster, tre projekt, inga JavaScriptfel och inga misslyckade resursanrop.

Mobilmeny, Escape, ankarnavigation, validering av sex obligatoriska fält, fokus på felsammanfattning, korrekt förhandsgranskning och kopiering godkända. Förhandsläget gjorde inga API-anrop. Integritet, robots och sitemap svarade 200; okänd sida gav riktig 404.

## Omgång 3 – övergång och tillgänglighet

Axe hittade två etiketter med för låg kontrast i konceptmockuperna. Tog bort deras transparens. Flyttade övertoningen från laptopscreen till HTML tidigare, så skärmtexten inte förstoras förbi vyn och dubbleras. Minskat materialets miljöreflektion ytterligare.

Ny dator- och mobilkontroll: 0 axe-överträdelser för WCAG 2 A/AA och WCAG 2.1 AA i de testade vyerna. Detta är en automatisk kontroll, inte en fullständig tillgänglighetscertifiering.

Reservläge utan WebGL visar statisk laptop och tar bort den förlängda scrollsektionen. Utan JavaScript är huvudbudskap och kontaktsektion nåbara. Byte till minskad rörelse eller mobil tar bort 3D-scenen; återgång till normal rörelse laddar den igen. Förhandsgranskningen tolkar inte HTML i inmatningen. Headerns ankarlänk landar med rubriken synlig nedanför navigationen.

Sista materialjusteringen kontrolleras separat genom final-shots.mjs: dator/mobil, skärmövergång, återgång till scrollposition 0 och avstannad rendering.

## Testresultat

- npm.cmd run build: godkänt.
- npm.cmd run check: godkänt.
- npm.cmd test: 8/8 godkända. Simulerade svar från mejlleverantören; inga mejl skickades.
- npm.cmd run verify: godkänt i samtliga sex lägen.
- scripts/edge-qa.mjs: godkänt; dator/mobil utan axe-fynd, ingen WebGL, ingen JavaScript, ändrad rörelsepreferens.
- qa/results.json och qa/edge-results.json innehåller råresultat.
- qa/final-desktop.png och qa/final-mobile.png visar slutdesignen.
- Övriga skärmbilder i qa visar sektioner, dialog, meny och scrollsteg.

## Faktiskt kvar före offentlig lansering

Riktig domän, e-post, telefon, teamuppgifter, gruppfoto, skola/ort och organisationsinformation. Integritetsutkastet behöver kompletteras. Kontaktformuläret är tydligt i lokalt förhandsläge. Resend, Cloudflare-hemligheter och riktig leverans behöver kopplas in och kontrolleras.

Fysiska telefoner, Safari och Firefox har inte testats. Ingen Lighthouse-poäng eller prestandagaranti påstås. 3D-biblioteket är en separat nätverksresurs och hämtas inte i de testade mobillägena. Laptopmodellen saknar externa texturer; original­loggan är JPEG som användaren skickade.


## Next.js-versionen, 2026-09-26

Ny App Router-sajt i samma undermapp. Den äldre statiska koden finns kvar som referens men ingår inte i Next-bygget.

### Omgång 1 – bygg och första inspektion

Byggde startsida, tjänster, beställning med paket och tillval, om oss, kontakt, konceptreferenser, 404 och tre juridiska utkast. Lade till cookieval, metadata, sitemap, robots, favicon och OG-bild. Första produktionsbygget och TypeScript-kontrollen gick igenom. Första helsidesbilderna på 1440×900 och 390×844 visade tomma avsnitt längre ned: Framer Motion dolde innehåll som ännu inte nått viewporten.

### Omgång 2 – konkreta rättningar

Ändrade reveal-effekten så text och kort alltid är synliga; en liten positionsförflyttning sker när de scrollas in. Flyttade mobilens ordersammanfattning efter val och formulär så paketvalet kommer först. Nya dator- och mobilbilder bekräftade synligt innehåll och tydligare ordning. Prisräkningen gav 19 900 kr som standard och 38 800 kr för Premium plus SEO-fördjupning.

### Omgång 3 – funktion och tillgänglighet

Verifierade giltiga och ogiltiga order och kontaktförfrågningar, cookieval inklusive detaljerade inställningar, mobilmeny, alla innehållssidor, sitemap, robots, API-fel och HTTP 404. Giltig formulärkontroll väntar nu på den asynkrona bekräftelsen. En testflik öppnade kontakt utan sparat cookieval; testet korrigerades att göra ett val före formulärinteraktion. Tillgänglighetskontroll med axe gav inga WCAG 2 A/AA eller 2.1 AA-överträdelser i testade dator- och mobilvyer. Dialogens tangentbordsfokus hålls inom cookiepanelen.

`npm.cmd run check`, `npm.cmd run build` och `npm.cmd run verify` gick igenom. Skärmbilder finns i `qa/next/`. Automatiska tester är inte en fullständig WCAG-certifiering.

### Kvar före offentlig lansering

Riktig domän, fungerande e-postadress, juridiskt företagsnamn och organisationsuppgifter behövs. Priser och villkor är vägledande utkast. API-rutterna är avsiktligt stubbar: ingen e-post skickas och ingen beställning lagras. Riktig leverans behöver serverhemligheter, spam- och missbruksskydd och uppdaterade integritets- och cookieuppgifter. Inga verkliga kundcase har uppgivits; referenserna är tydligt märkta koncept.

## Visuell omarbetning med användarens logotyp, 2026-09-26

### Omgång 1 – ny visuell riktning

Kopierade användarens JPEG oförändrad till `public/webbsmedjan-logo.jpeg`. Visade hela bilden på en ljus platta i startsidans hero och beskär endast visningen av dess emblem i navigationen. Bytte palett till mörkt stål, varmt vitt och loggans orange. Lade till scrollstyrd förskjutning av loggplattan, en tunn scrollindikator, processlinje som fylls vid scrollning och tydligare hoverrespons. Innehåll förblir synligt innan animationer startar.

Första dator- och mobilbilderna visade att tjänstesidan hade för långt tomrum före sin CTA. Alla viktigare funktioner och automatiska WCAG A/AA-kontroller gick igenom. Scrollindikatorn ändrade skala efter scrollning.

### Omgång 2 – justering och ny kontroll

Kortade mellanrummet före CTA:n och gav tjänsteraderna en diskret scrollentré. Använde originalbilden även på Om oss och i Open Graph. Nya bilder på startsida, tjänster, beställning och Om oss vid 1440 och 390 px visade inget horisontellt överflöde. Logotypen laddades på startsida och Om oss. `npm.cmd run check`, `npm.cmd run build` och `npm.cmd run verify` gick igenom efter ändringarna. Skärmbilder finns i `qa/next/`.

Minskad rörelse behåller läsbarhet och statisk loggplatta. Fysiska telefoner och andra webbläsare än testmiljön har inte kontrollerats i denna omgång.

## UF-beställning, 2026-09-30

Omgång 1: implementerade UF-switch, separata priser, Animationer, kompaktare paket och tillval samt kortare text på startsida och kontakt. Granskade skärmbilder vid 1440 och 390 px. Lokala mejltester bekräftade mottagare, företagstyp och serverberäknade priser: Premium + SEO + extra sida + animationer = 1 550 kr för UF och 8 100 kr för företag.

Omgång 2: lade mobilens totalpris före skicka-knappen och rättade testerna för svenska fasta tusentalsmellanslag. Nya skärmbilder granskades. `npm.cmd run check`, `npm.cmd run build`, `npm.cmd run verify` och `npm.cmd run verify:email` gick igenom. Tester täcker tangentbord, bibehållna kunduppgifter/tillval, API-payload, formulärvalidering, simulerad framgång, serverns leveransfel och WCAG A/AA via axe. Inga horisontella överflöden eller axe-fel i dator- och mobilvyn.

Frontend Premium statisk audit kördes i strict med app/components/lib som aktiva källrötter. Två begränsningar kvar i statisk analys: den upptäcker inte CookieConsents befintliga event listener på sidfotens cookieknapp (funktion verifierad i browser-test), och den vill förbjuda textarea-resize som här medvetet behålls. Äldre ignorerad src/ används inte av den publicerade Vinext-appen.

Skärmbilder: qa/next/desktop-order.png och mobile-order.png. Mejlleverans är simulerad i denna ändringsomgång; inga nya kundmejl skickades. Verklig Cloudflare-leverans till Gmail verifierades av användaren i föregående omgång. Fysiska telefoner har inte testats.

## Säkerhets- och bugggranskning, 2026-09-30

Tre omgångar genomförda: paket/transport/API-hårdning; verifierad korrigering av rotregel och Zod JIT för CSP; videons sena autoplay vid minskad rörelse. Se SECURITY-REVIEW.md för fynd och kvarvarande begränsningar.

Slutbygge och TypeScript passerade. verify, verify:links, verify:email och verify:security passerade. npm audit: 0 kända sårbarheter. Granskade bilder i qa/security/ på dator och mobil. Cookiepanelen fungerar också i 640x360: övre kant 20 px, nedre kant 340 px, internt scrollbart innehåll. Formulärens loading/fel/retry/success, bibehållna uppgifter, spärrat nytt klick, cookieval med blockerad/felaktig lagring, fokus, CSP-nonce och frånvaro av CSP-överträdelser verifierades.

Cloudflare Always Use HTTPS ändrades till på och lägsta TLS till 1.2. HTTP /kontakt?test=https gav 301 till HTTPS med bevarad adress. Live-läsningar visade 404 för interna filer. Mönsterskanning gav inga hemlighetsmatchningar i 65 spårade filer eller 7 tidigare commits. Inga riktiga mejl eller belastningsattacker gjordes.
