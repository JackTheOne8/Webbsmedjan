# Webbsmedjan – Next.js designriktning

## Identitet

Digital smedja: kallt stål möter varm glöd. Den av användaren tillhandahållna JPEG-loggan är original och visas oförändrad på sidan Om oss. Navigationen visar en beskuren vy av dess emblem. Heron visar användarens video där en laptop öppnas och visar en webbplats; videon loopar, har en stillbild medan den laddar och kan pausas. Den återkommande orange färgen kommer från loggans text.

## Tokens

Källan för aktiva färger är `app/forge.css`: kol `#10191d`, stålyta `#1b272c`, djup yta `#26343a`, varmt vitt `#f6f2e9`, sekundär text `#b9c4c6`, glöd `#f27624`, linje `#405055`. `app/globals.css` innehåller grundlayout och äldre neutrala regler; `forge.css` är den aktiva visuella överskrivningen.

Typografi: kondenserad systemdisplay (`Arial Narrow`/`Bahnschrift`), neutral sans för brödtext och spärrade versaler för små etiketter. Stora rubriker, luft mellan avsnitt och skarpa kanter med få undantag.

## Rörelse

En tunn scrollindikator följer hela sidan. Hero-videon spelas automatiskt utan ljud och loopar. Vid `prefers-reduced-motion` pausas den och kan startas manuellt. Processens glödlinje fylls i läsordning. Övriga avsnitt får en kort positionsentré utan att innehållet döljs. Hover ger lokal respons på knappar, tjänsterader och kort. Innehåll och val är alltid synliga.

## Principer

- Originalbilden får inte ritas om eller ersättas med påhittad logotyptext.
- Inga påhittade kundcase, recensioner eller resultatmått. Koncept märks som koncept.
- Konceptkorten visar fiktiva webbplatser för olika verksamheter. De har egna bildvärldar och namnges tydligt som idéer, inte levererade projekt.
- Formulär och orderflöde förblir tydliga och tangentbordsanvändbara.
- Kontrast, fokus och mobilbredd prioriteras före dekorativa effekter.

## Beställning – UF och företag

`OrderBuilder` äger paketval, UF-reglage och sammanfattning. `InquiryFields` är gemensam för beställning och kontakt. `lib/site.ts` äger priserna som både gränssnittet och mejlservern använder; klientens totalpris accepteras aldrig som priskälla.

UF-reglaget är avstängt från början. Bas/Standard/Premium kostar 350/700/1 200 kr för UF och 2 000/4 000/6 500 kr för företag. Tillval kostar 75–250 kr respektive 400–1 200 kr. Animationer kostar 150 kr för UF och 600 kr för företag. Priser är exklusive moms och förfrågan bekräftas med offert.

Ett byte behåller paket, tillval och kontaktuppgifter. Reglagets tumme har en kort fjädrande rörelse och priser byts med en 180 ms entré; minskad rörelse ger direkt byte. Native radio/checkbox, ett namngivet ARIA-switch-reglage och en uppläst totalsumma bevarar tangentbordsflödet. Mobilen visar totalpris före skicka-knappen.

Texten hålls kort på startsida, beställning och kontakt; samtycke, offertinformation och konceptmärkning behålls. Textfältet behåller native storleksändring för längre projektbeskrivningar. Cookieknappen använder befintlig händelselyssnare i `CookieConsent`.

## Säkerhet och felåterhämtning

Cookiepanelen är en modal dialog med inert bakgrund, intern fokusordning och återställt fokus. Escape väljer endast nödvändiga; blockerad lagring får inte låsa sidan. Formulär visar svenska, generiska fel och behåller uppgifter efter misslyckat utskick. Fälten låses under sändning och efter lyckad kvittens.

CSP använder en nonce per dokument; script körs utan eval eller unsafe-inline i produktion. Inline style-attribut krävs för befintliga animationer. Videons minskade rörelse gäller även när ett sent autoplay-event kommer; manuell uppspelning är fortfarande tillåten.
