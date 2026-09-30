import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Ange ditt namn.').max(120, 'Namnet är för långt.'),
  email: z.email('Ange en giltig e-postadress.').max(254),
  company: z.string().trim().min(2, 'Ange företagets namn.').max(160, 'Företagsnamnet är för långt.'),
  message: z.string().trim().min(10, 'Beskriv ert projekt med minst 10 tecken.').max(5000, 'Beskriv projektet med högst 5 000 tecken.'),
  website: z.string().max(0, 'Förfrågan kunde inte skickas.').optional(),
  consent: z.literal(true, { error: 'Du behöver godkänna att vi behandlar uppgifterna.' }),
});
export type ContactValues = z.infer<typeof contactSchema>;

export const orderSchema = contactSchema.extend({
  packageId: z.enum(['bas', 'standard', 'premium']),
  addons: z.array(z.enum(['extra', 'seo', 'copy', 'care'])).max(4).refine(values => new Set(values).size === values.length),
});
export type OrderValues = z.infer<typeof orderSchema>;
