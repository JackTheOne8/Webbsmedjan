export const concepts = [
  {
    id: 'rum-och-ro', number: '01', category: 'LOKALT FÖRETAG', name: 'Rum & Ro',
    heading: 'Plats för lugn.',
    description: 'Ett varmt, luftigt koncept för en inredningsstudio där bild och bokning får ta plats.',
    image: '/concepts/rum-och-ro.webp',
    imageAlt: 'Solbelyst inredningsstudio med träfåtölj och keramik',
    theme: 'interior',
  },
  {
    id: 'forma', number: '02', category: 'E-HANDEL', name: 'Forma',
    heading: 'Föremål att leva med.',
    description: 'En produktupplevelse för handgjord keramik med tydlig väg från upptäckt till köp.',
    image: '/concepts/forma.webp',
    imageAlt: 'Handgjorda kärl i koboltblått och elfenbensvitt',
    theme: 'shop',
  },
  {
    id: 'linje', number: '03', category: 'KREATIV STUDIO', name: 'Linje',
    heading: 'Form som rör sig.',
    description: 'Ett uttrycksfullt studiokoncept där stark typografi gör arbetet till huvudperson.',
    image: null, imageAlt: '', theme: 'studio',
  },
] as const;
