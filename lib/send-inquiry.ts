import { site } from './site';

export async function sendInquiry(kind: 'order' | 'contact', values: object): Promise<string> {
  const fallback = `Mejlet kunde inte skickas. Försök igen eller mejla ${site.email} direkt.`;
  let response: Response;
  try {
    response = await fetch(`/api/${kind}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
  } catch { throw new Error(fallback); }
  let data: unknown;
  try { data = await response.json(); } catch { throw new Error(fallback); }
  if (!data || typeof data !== 'object') throw new Error(fallback);
  if (!response.ok || !('success' in data) || data.success !== true || !('message' in data) || typeof data.message !== 'string') {
    throw new Error('error' in data && typeof data.error === 'string' ? data.error : fallback);
  }
  return data.message;
}
