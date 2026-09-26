import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().trim().min(2, 'Ange ditt namn.'),
  email: z.email('Ange en giltig e-postadress.'),
  company: z.string().trim().min(2, 'Ange företagets namn.'),
  message: z.string().trim().min(10, 'Beskriv ert projekt med minst 10 tecken.'),
  consent: z.literal(true, { error: 'Du behöver godkänna att vi behandlar uppgifterna.' }),
});
export type ContactValues = z.infer<typeof contactSchema>;

export const orderSchema = contactSchema.extend({
  packageId: z.enum(['bas', 'standard', 'premium']),
  addons: z.array(z.enum(['extra', 'seo', 'copy', 'care'])),
});
export type OrderValues = z.infer<typeof orderSchema>;
