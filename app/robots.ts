import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
export default function robots(): MetadataRoute.Robots { return { rules: { userAgent: '*', allow: site.indexable ? '/' : undefined, disallow: site.indexable ? undefined : '/' }, sitemap: site.indexable ? `${site.url}/sitemap.xml` : undefined }; }
