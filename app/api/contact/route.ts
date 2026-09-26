import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/schemas';
export async function POST(request: Request) {
  try { const body = await request.json(); const parsed = contactSchema.safeParse(body); if (!parsed.success) return NextResponse.json({ error: 'Ogiltiga uppgifter.' }, { status: 400 }); return NextResponse.json({ demo: true, message: 'Förfrågan validerad. Ingen e-post skickad.' }, { status: 202 }); }
  catch { return NextResponse.json({ error: 'Ogiltig begäran.' }, { status: 400 }); }
}
