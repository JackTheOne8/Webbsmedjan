import type { MetadataRoute } from 'next';
import { site } from '@/lib/site';
export default function sitemap(): MetadataRoute.Sitemap { return ['', '/tjanster', '/bestall', '/om-oss', '/kontakt', '/referenser', '/integritet', '/cookies', '/villkor'].map(path => ({ url: `${site.url}${path}`, lastModified: new Date(), changeFrequency: path ? 'monthly' : 'weekly', priority: path ? .6 : 1 })); }
