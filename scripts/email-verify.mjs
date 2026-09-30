import { build } from 'esbuild';
import { mkdir } from 'node:fs/promises';
import { pathToFileURL, fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

await mkdir('.wrangler/tests', { recursive: true });
await build({
  absWorkingDir: process.cwd(), tsconfig: './tsconfig.json', entryPoints: [fileURLToPath(new URL('../lib/submit-inquiry.ts', import.meta.url))], outfile: '.wrangler/tests/inquiry.mjs', bundle: true, platform: 'node', format: 'esm',
  plugins: [{ name: 'email-test-bindings', setup(builder) {
    builder.onResolve({ filter: /^cloudflare:/ }, args => ({ path: args.path, namespace: 'email-test' }));
    builder.onLoad({ filter: /.*/, namespace: 'email-test' }, args => ({ contents: args.path === 'cloudflare:workers'
      ? 'export const env = globalThis.__emailTestEnv;'
      : 'export class EmailMessage { constructor(from,to,raw) { Object.assign(this,{from,to,raw}); } }', loader: 'js' }));
  } }],
});
const sent = [];
globalThis.__emailTestEnv = {
  INQUIRY_EMAIL: { send: async message => { sent.push(message); } },
  INQUIRY_RATE_LIMIT: { limit: async () => ({ success: true }) },
};
const { submitInquiry } = await import(pathToFileURL(`${process.cwd()}/.wrangler/tests/inquiry.mjs`));
const values = { name: 'Test Åsa', email: 'conect.webbsmedjan@gmail.com', company: 'Test & <Studio>', message: 'Tydlig projektbeskrivning med åäö och <script>innehåll</script>.', consent: true, packageId: 'premium', addons: ['seo', 'extra'], total: 1, to: 'attacker@example.com' };
const request = (data, headers = {}) => new Request('https://webbsmedjan.com/api/order', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://webbsmedjan.com', 'cf-connecting-ip': 'test-client', ...headers }, body: JSON.stringify(data) });
let response = await submitInquiry(request(values), 'order');
assert.equal(response.status, 200);
assert.equal((await response.json()).success, true);
assert.equal(sent.length, 1);
assert.equal(sent[0].to, 'conect.webbsmedjan@gmail.com');
assert.equal(sent[0].from, 'formular@webbsmedjan.com');
assert.match(sent[0].raw, /Reply-To: conect.webbsmedjan@gmail.com/);
const parts = [...sent[0].raw.matchAll(/Content-Transfer-Encoding: base64\r\n\r\n([A-Za-z0-9+/=\r\n]+?)(?=\r\n--)/g)].map(match => Buffer.from(match[1].replaceAll('\r\n', ''), 'base64').toString('utf8'));
assert.equal(parts.length, 2);
assert.match(parts[0], /Premium/);
assert.match(parts[0].replaceAll('\u00a0', ' '), /40 600 kr exklusive moms/);
assert.match(parts[0], /SEO-fördjupning/);
assert.match(parts[0], /Extra sida/);
assert.match(parts[1], /&lt;script&gt;/);
assert.doesNotMatch(parts[1], /<script>/);
assert.doesNotMatch(sent[0].raw, /attacker@example.com/);
for (const bad of [{...values, consent:false}, {...values, packageId:'fake'}, {...values, addons:['seo','seo']}, {...values, website:'bot'}, {...values, message:'x'.repeat(5001)}, {...values, email:'x@example.com\r\nBcc: y@example.com'}]) {
  assert.equal((await submitInquiry(request(bad), 'order')).status, 400);
}
assert.equal((await submitInquiry(request(values, {Origin:'https://other.example'}), 'order')).status, 403);
assert.equal((await submitInquiry(request(values, {'Content-Type':'text/plain'}), 'order')).status, 415);
assert.equal((await submitInquiry(request({...values,message:'x'.repeat(25000)}), 'order')).status, 413);
globalThis.__emailTestEnv.INQUIRY_RATE_LIMIT.limit = async () => ({ success: false });
assert.equal((await submitInquiry(request(values), 'order')).status, 429);
globalThis.__emailTestEnv.INQUIRY_RATE_LIMIT.limit = async () => ({ success: true });
globalThis.__emailTestEnv.INQUIRY_EMAIL.send = async () => { throw new Error('Delivery unavailable'); };
response = await submitInquiry(request(values), 'contact');
assert.equal(response.status, 503);
assert.equal((await response.json()).success, undefined);
assert.equal(sent.length, 1);
console.log('Email recipient, MIME, Swedish text, totals, escaping, validation, rate limit and delivery failure checks passed.');
