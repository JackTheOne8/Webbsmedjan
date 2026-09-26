# Webbsmedjan – Next.js designriktning

## Identitet

Digital smedja: kallt stål möter varm glöd. Den av användaren tillhandahållna JPEG-loggan är original och visas oförändrad på ljus platta i hero och om oss. Navigationen visar en beskuren vy av dess emblem. Den återkommande orange färgen kommer från loggans text.

## Tokens

Källan för aktiva färger är `app/forge.css`: kol `#10191d`, stålyta `#1b272c`, djup yta `#26343a`, varmt vitt `#f6f2e9`, sekundär text `#b9c4c6`, glöd `#f27624`, linje `#405055`. `app/globals.css` innehåller grundlayout och äldre neutrala regler; `forge.css` är den aktiva visuella överskrivningen.

Typografi: kondenserad systemdisplay (`Arial Narrow`/`Bahnschrift`), neutral sans för brödtext och spärrade versaler för små etiketter. Stora rubriker, luft mellan avsnitt och skarpa kanter med få undantag.

## Rörelse

En tunn scrollindikator följer hela sidan. På startsidan rör sig loggplattan lätt mot scrollen och processens glödlinje fylls i läsordning. Övriga avsnitt får en kort positionsentré utan att innehållet döljs. Hover ger lokal respons på knappar, tjänsterader och kort. `prefers-reduced-motion` tar bort den rumsliga rörelsen; innehåll och val är alltid synliga.

## Principer

- Originalbilden får inte ritas om eller ersättas med påhittad logotyptext.
- Inga påhittade kundcase, recensioner eller resultatmått. Koncept märks som koncept.
- Formulär och orderflöde förblir tydliga och tangentbordsanvändbara.
- Kontrast, fokus och mobilbredd prioriteras före dekorativa effekter.
