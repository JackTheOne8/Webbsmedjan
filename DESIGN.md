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
