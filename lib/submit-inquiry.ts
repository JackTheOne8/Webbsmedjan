import { env } from 'cloudflare:workers';
import { EmailMessage } from 'cloudflare:email';
import { contactSchema, orderSchema } from './schemas';
import { site } from './site';
import { createInquiryMessage, inquirySender } from './inquiry-message';

const maxBodyBytes = 24000;
const json = (data: object, status = 200, headers: Record<string, string> = {}) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store', ...headers } });

async function readBody(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) return '';
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > maxBodyBytes) {
        // Stop consuming a chunked upload as soon as it crosses the limit.
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

export async function submitInquiry(request: Request, kind: 'order' | 'contact') {
  const origin = request.headers.get('origin');
  if (origin !== new URL(request.url).origin || request.headers.get('sec-fetch-site') === 'cross-site') return json({ error: 'Skicka förfrågan från webbplatsens formulär.' }, 403);
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return json({ error: 'Ogiltig begäran.' }, 415);
  if (Number(request.headers.get('content-length')) > maxBodyBytes) return json({ error: 'Förfrågan är för stor.' }, 413);
  let body;
  try {
    const raw = await readBody(request);
    if (raw === null) return json({ error: 'Förfrågan är för stor.' }, 413);
    body = JSON.parse(raw);
  } catch { return json({ error: 'Ogiltig begäran.' }, 400); }
  const parsed = (kind === 'order' ? orderSchema : contactSchema).safeParse(body);
  if (!parsed.success) return json({ error: 'Kontrollera uppgifterna och försök igen.' }, 400);
  const reference = `WS-${crypto.randomUUID()}`;
  try {
    const bindings = env as Cloudflare.Env;
    if (!bindings.INQUIRY_EMAIL || !bindings.INQUIRY_RATE_LIMIT) throw new Error('Missing inquiry bindings');
    const ip = request.headers.get('cf-connecting-ip');
    // Missing edge identity must not disable the limiter.
    if (!(await bindings.INQUIRY_RATE_LIMIT.limit({ key: `inquiry:${ip || 'unknown'}` })).success) {
      return json({ error: 'Du har skickat flera förfrågningar. Vänta en minut och försök igen.' }, 429, { 'Retry-After': '60' });
    }
    const message = createInquiryMessage(kind, parsed.data, reference);
    await bindings.INQUIRY_EMAIL.send(new EmailMessage(inquirySender, site.email, message.raw));
    return json({ success: true, reference, message: `Tack! Din förfrågan har skickats till ${site.email}. Vi återkommer via e-post. Referens: ${reference}.` });
  } catch {
    // Keep customer details out of operational logs and never report a failed send as successful.
    console.error('inquiry_delivery_failed', { reference, kind });
    return json({ error: `Mejlet kunde inte skickas. Försök igen eller mejla ${site.email} direkt.` }, 503);
  }
}
