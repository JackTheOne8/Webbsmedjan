import { packages, addons, money, site, priceFor } from './site';
import type { ContactValues, OrderValues } from './schemas';

export const inquirySender = 'formular@webbsmedjan.com';
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]!));
const base64 = (value: string) => btoa(Array.from(new TextEncoder().encode(value), byte => String.fromCharCode(byte)).join(''));

export function createInquiryMessage(kind: 'order' | 'contact', values: ContactValues | OrderValues, reference: string, date = new Date()) {
  const title = kind === 'order' ? 'Ny beställningsförfrågan' : 'Ny kontaktförfrågan';
  const rows: [string, string][] = [
    ['Referens', reference],
    ['Inskickad', new Intl.DateTimeFormat('sv-SE', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Stockholm' }).format(date)],
    ['Företag', values.company], ['Kontaktperson', values.name], ['E-post / svaradress', values.email],
  ];
  if (kind === 'order' && 'packageId' in values) {
    const pack = packages.find(item => item.id === values.packageId)!;
    // Prices come from the server's catalogue, never from a submitted total.
    const chosen = addons.filter(item => values.addons.includes(item.id));
    const isUf = values.isUf === true;
    rows.push(['Företagstyp', isUf ? 'UF-företag' : 'Företag']);
    rows.push(['Paket', `${pack.name} – ${money(priceFor(pack, isUf))}`]);
    rows.push(['Tillval', chosen.length ? chosen.map(item => `${item.name} – ${money(priceFor(item, isUf))}`).join('\n') : 'Inga tillval']);
    rows.push(['Uppskattat totalpris', `${money(priceFor(pack, isUf) + chosen.reduce((sum, item) => sum + priceFor(item, isUf), 0))} exklusive moms`]);
  }
  const note = kind === 'order' ? 'Detta är en beställningsförfrågan. Ingen betalning har genomförts. Bekräfta omfattning och pris i en separat offert.' : 'Besökaren vill komma i kontakt med Webbsmedjan.';
  const text = `${title}\n\n${rows.map(([label, value]) => `${label}: ${value}`).join('\n\n')}\n\nProjektbeskrivning / meddelande:\n${values.message}\n\nSamtycke till att hantera förfrågan: Ja\n\n${note}\n\nSvara på detta mejl för att kontakta ${values.name}.`;
  const html = `<html lang="sv"><body style="font-family:Arial,sans-serif;color:#242424;max-width:640px;margin:32px auto;padding:24px"><h1 style="font-size:26px">${title}</h1><table style="border-collapse:collapse;width:100%">${rows.map(([label, value]) => `<tr><th style="text-align:left;vertical-align:top;padding:12px 16px 12px 0;border-bottom:1px solid #ddd">${escapeHtml(label)}</th><td style="padding:12px 0;border-bottom:1px solid #ddd;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`).join('')}</table><h2 style="font-size:20px">Projektbeskrivning / meddelande</h2><p style="white-space:pre-wrap">${escapeHtml(values.message)}</p><p>Samtycke till att hantera förfrågan: Ja</p><p>${note}</p><p>Svara på mejlet för att kontakta ${escapeHtml(values.name)}.</p></body></html>`;
  const subject = `${title} – ${reference}`;
  const boundary = `webbsmedjan-${reference}`;
  const encodedBody = (value: string) => base64(value).match(/.{1,76}/g)!.join('\r\n');
  // MIME keeps this compatible with the free, verified-recipient email binding.
  const raw = [
    `From: Webbsmedjan <${inquirySender}>`, `To: ${site.email}`, `Reply-To: ${values.email}`,
    `Subject: =?UTF-8?B?${base64(subject)}?=`, `Date: ${date.toUTCString()}`,
    `Message-ID: <${reference}@webbsmedjan.com>`, 'MIME-Version: 1.0',
    `Content-Type: multipart/alternative; boundary="${boundary}"`, '',
    `--${boundary}`, 'Content-Type: text/plain; charset=UTF-8', 'Content-Transfer-Encoding: base64', '', encodedBody(text),
    `--${boundary}`, 'Content-Type: text/html; charset=UTF-8', 'Content-Transfer-Encoding: base64', '', encodedBody(html),
    `--${boundary}--`, '',
  ].join('\r\n');
  return { raw, text, html, subject };
}
