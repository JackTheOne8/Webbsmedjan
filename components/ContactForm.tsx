'use client';
import { Icon } from '@/components/Icon';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactValues } from '@/lib/schemas';
import { InquiryFields } from './InquiryFields';
import { sendInquiry } from '@/lib/send-inquiry';
import { site } from '@/lib/site';
export function ContactForm() {
  const [result, setResult] = useState('');
  const [sent, setSent] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ContactValues>({ resolver: zodResolver(contactSchema), defaultValues: { consent: false as true } });
  const submit = handleSubmit(async values => {
    setResult('');
    try {
      setResult(await sendInquiry('contact', values));
      setSent(true);
    } catch (error) {
      setResult(error instanceof Error ? error.message : 'Mejlet kunde inte skickas. Försök igen eller kontakta oss via e-post.');
    }
  });
  return <form onSubmit={submit} noValidate className="inquiry-form" aria-busy={isSubmitting}><fieldset className="contact-fields" disabled={isSubmitting || sent}><legend className="sr-only">Kontaktuppgifter och meddelande</legend><InquiryFields register={register} errors={errors}/><button type="submit" className="button" disabled={isSubmitting || sent}>{isSubmitting ? 'Skickar…' : sent ? 'Skickat' : 'Skicka förfrågan'} <span aria-hidden="true"><Icon name="arrow-up-right"/></span></button></fieldset><p className="form-note">Din förfrågan skickas till {site.email}.</p><p role="status" className="form-status">{result}</p></form>;
}
