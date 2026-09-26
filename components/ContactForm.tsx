'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactValues } from '@/lib/schemas';
import { InquiryFields } from './InquiryFields';
export function ContactForm() {
  const [result, setResult] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactValues>({ resolver: zodResolver(contactSchema), defaultValues: { consent: false as true } });
  const submit = handleSubmit(async values => {
    setResult('');
    try { const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) }); if (!response.ok) throw Error(); setResult('Förfrågan har validerats i demoversionen. Ingen e-post har skickats. Kontakta oss via e-post för att skicka den på riktigt.'); }
    catch { setResult('Det gick inte att behandla förfrågan. Försök igen eller skriv till oss via e-post.'); }
  });
  return <form onSubmit={submit} noValidate className="inquiry-form"><InquiryFields register={register} errors={errors}/><button type="submit" className="button" disabled={isSubmitting}>{isSubmitting ? 'Behandlar…' : 'Skicka förfrågan'} <span aria-hidden="true">↗</span></button><p className="form-note">Demoläge: formuläret kontrolleras men skickar ännu ingen e-post.</p><p role="status" className="form-status">{result}</p></form>;
}
