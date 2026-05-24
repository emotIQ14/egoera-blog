import type { MetadataRoute } from 'next';
import { getAllPostSlugs, getCategories } from '@/lib/wp';

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://blog.egoera.es';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
  ];

  try {
    const [slugs, cats] = await Promise.all([
      getAllPostSlugs(),
      getCategories(),
    ]);

    const postRoutes = slugs.map((slug) => ({
      url: `${baseUrl}/${slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    const catRoutes = cats.map((c) => ({
      url: `${baseUrl}/categoria/${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...postRoutes, ...catRoutes];
  } catch {
    return staticRoutes;
  }
}
