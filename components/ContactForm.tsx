'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactValues } from '@/lib/schemas';
import { InquiryFields } from './InquiryFields';
export function ContactForm() {
  const [result, setResult] = useState('');
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactValues>({ resolver: zodResolver(contactSchema), defaultValues: { consent: false as true } });
  const submit = handleSubmit(async values => {
    setResult('');
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
      const data = await response.json() as { success?: boolean; message: string; error?: string };
      if (!response.ok || !data.success) throw new Error(data.error || 'Mejlet kunde inte skickas. Försök igen.');
      setResult(data.message);
      setSent(true);
    } catch (error) {
      setResult(error instanceof Error ? error.message : 'Mejlet kunde inte skickas. Försök igen eller kontakta oss via e-post.');
    }
  });
  return <form onSubmit={submit} noValidate className="inquiry-form"><InquiryFields register={register} errors={errors}/><button type="submit" className="button" disabled={isSubmitting || sent}>{isSubmitting ? 'Skickar…' : sent ? 'Skickat' : 'Skicka förfrågan'} <span aria-hidden="true">↗</span></button><p className="form-note">Din förfrågan skickas till conect.webbsmedjan@gmail.com.</p><p role="status" className="form-status">{result}</p></form>;
}
