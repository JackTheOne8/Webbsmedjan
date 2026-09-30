import { env } from 'cloudflare:workers';
import { EmailMessage } from 'cloudflare:email';
import { contactSchema, orderSchema } from './schemas';
import { site } from './site';
import { createInquiryMessage, inquirySender } from './inquiry-message';

export async function submitInquiry(request: Request, kind: 'order' | 'contact') {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: 'Skicka förfrågan från webbplatsens formulär.' }, { status: 403 });
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ error: 'Ogiltig begäran.' }, { status: 415 });
  if (Number(request.headers.get('content-length')) > 24000) return Response.json({ error: 'Förfrågan är för stor.' }, { status: 413 });
  let body;
  try {
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 24000) return Response.json({ error: 'Förfrågan är för stor.' }, { status: 413 });
    body = JSON.parse(raw);
  } catch { return Response.json({ error: 'Ogiltig begäran.' }, { status: 400 }); }
  const parsed = (kind === 'order' ? orderSchema : contactSchema).safeParse(body);
  if (!parsed.success) return Response.json({ error: 'Kontrollera uppgifterna och försök igen.' }, { status: 400 });
  const reference = `WS-${crypto.randomUUID()}`;
  try {
    const bindings = env as Cloudflare.Env;
    if (!bindings.INQUIRY_EMAIL || !bindings.INQUIRY_RATE_LIMIT) throw new Error('Missing inquiry bindings');
    const ip = request.headers.get('cf-connecting-ip');
    if (ip && !(await bindings.INQUIRY_RATE_LIMIT.limit({ key: `inquiry:${ip}` })).success) {
      return Response.json({ error: 'Du har skickat flera förfrågningar. Vänta en minut och försök igen.' }, { status: 429, headers: { 'Retry-After': '60' } });
    }
    const message = createInquiryMessage(kind, parsed.data, reference);
    await bindings.INQUIRY_EMAIL.send(new EmailMessage(inquirySender, site.email, message.raw));
    return Response.json({ success: true, reference, message: `Tack! Din förfrågan har skickats till ${site.email}. Vi återkommer via e-post. Referens: ${reference}.` });
  } catch {
    // Keep customer details out of operational logs and never report a failed send as successful.
    console.error('inquiry_delivery_failed', { reference, kind });
    return Response.json({ error: `Mejlet kunde inte skickas. Försök igen eller mejla ${site.email} direkt.` }, { status: 503 });
  }
}
