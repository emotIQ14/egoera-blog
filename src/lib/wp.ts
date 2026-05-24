/**
 * Cliente WordPress REST API para egoera.es
 *
 * Convención:
 * - Todas las funciones usan ISR (revalidate: 3600) para que Next.js
 *   sirva caché 1h y revalide automáticamente cuando publiques en WP.
 * - `_embed=1` trae featured_media + author + terms inline para
 *   evitar requests adicionales por post.
 */

const WP_BASE = 'https://egoera.es/wp-json/wp/v2';
const REVALIDATE_S = 3600; // 1h

export type WPPost = {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  categories: number[];
  tags: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text: string; media_details?: { width: number; height: number } }>;
    author?: Array<{ name: string; url: string; avatar_urls?: Record<string, string> }>;
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string; taxonomy: string }>>;
  };
};

export type WPCategory = {
  id: number;
  count: number;
  name: string;
  slug: string;
  description: string;
};

async function wpFetch<T>(path: string): Promise<T> {
  const url = `${WP_BASE}${path}`;
  const res = await fetch(url, {
    next: { revalidate: REVALIDATE_S },
    headers: {
      'User-Agent': 'EgoeraBlog/1.0 (+https://blog.egoera.es)',
    },
  });
  if (!res.ok) {
    throw new Error(`WP REST ${res.status}: ${url}`);
  }
  return res.json() as Promise<T>;
}

export async function getPosts(opts: {
  per_page?: number;
  page?: number;
  category?: number;
  search?: string;
} = {}): Promise<WPPost[]> {
  const params = new URLSearchParams();
  params.set('per_page', String(opts.per_page ?? 10));
  params.set('page', String(opts.page ?? 1));
  params.set('_embed', '1');
  params.set('orderby', 'date');
  params.set('order', 'desc');
  if (opts.category) params.set('categories', String(opts.category));
  if (opts.search) params.set('search', opts.search);

  return wpFetch<WPPost[]>(`/posts?${params.toString()}`);
}

export async function getPostBySlug(slug: string): Promise<WPPost | null> {
  const params = new URLSearchParams();
  params.set('slug', slug);
  params.set('_embed', '1');
  const data = await wpFetch<WPPost[]>(`/posts?${params.toString()}`);
  return data[0] ?? null;
}

export async function getAllPostSlugs(): Promise<string[]> {
  // Paginamos hasta agotar para sitemap / generateStaticParams
  const slugs: string[] = [];
  let page = 1;
  while (true) {
    const batch = await wpFetch<Array<{ slug: string }>>(`/posts?per_page=100&page=${page}&_fields=slug`);
    if (batch.length === 0) break;
    slugs.push(...batch.map((p) => p.slug));
    if (batch.length < 100) break;
    page += 1;
  }
  return slugs;
}

export async function getCategories(): Promise<WPCategory[]> {
  return wpFetch<WPCategory[]>('/categories?per_page=100&orderby=count&order=desc');
}

export async function getCategoryBySlug(slug: string): Promise<WPCategory | null> {
  const data = await wpFetch<WPCategory[]>(`/categories?slug=${encodeURIComponent(slug)}`);
  return data[0] ?? null;
}

/**
 * Calcula tiempo de lectura estimado (200 wpm).
 * Limpia HTML tags del content.rendered antes de contar.
 */
export function estimateReadingMinutes(htmlContent: string): number {
  const text = htmlContent.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = text.split(' ').filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Decodifica HTML entities en títulos y excerpts. */
export function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&hellip;/g, '…')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .replace(/&iquest;/g, '¿')
    .replace(/&iexcl;/g, '¡')
    .replace(/&#8217;/g, '’')
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”');
}

/** Limpia un excerpt HTML (quita <p>, [&hellip;], etc.) para preview. */
export function cleanExcerpt(htmlExcerpt: string, maxLen = 160): string {
  const text = htmlExcerpt
    .replace(/<[^>]+>/g, '')
    .replace(/\[&hellip;\]|\[\.\.\.\]/g, '…')
    .replace(/\s+/g, ' ')
    .trim();
  const decoded = decodeHtmlEntities(text);
  return decoded.length > maxLen ? decoded.slice(0, maxLen - 1) + '…' : decoded;
}
