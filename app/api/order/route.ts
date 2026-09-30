import { submitInquiry } from '@/lib/submit-inquiry';
export const POST = (request: Request) => submitInquiry(request, 'order');
