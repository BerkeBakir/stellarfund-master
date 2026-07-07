import type { MetadataRoute } from 'next';

export const BASE_URL = 'https://stellarfund-master.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/proof', '/create', '/stats'];
  const now = new Date();
  return routes.map((path) => ({
    url: `${BASE_URL}${path || '/'}`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: path === '' ? 1 : 0.7,
  }));
}
