import { getCategoryBySlug, getPosts, getCategories } from '@/lib/wp';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 3600;
export const dynamicParams = true;

type Params = { slug: string };

export async function generateStaticParams() {
  try {
    const cats = await getCategories();
    return cats.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return { title: 'Categoría no encontrada' };
  return {
    title: cat.name,
    description: `Lecturas sobre ${cat.name.toLowerCase()} en Egoera Blog.`,
    alternates: { canonical: `/categoria/${slug}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) notFound();
  const posts = await getPosts({ category: cat.id, per_page: 30 });

  return (
    <div className="cat-page">
      <header className="cat-header container">
        <Link href="/" className="back-link">← Volver al blog</Link>
        <p className="eyebrow">— Categoría —</p>
        <h1 className="cat-title">
          <em className="italic">{cat.name}</em>
        </h1>
        {cat.description && <p className="cat-desc">{cat.description}</p>}
        <p className="cat-count">{cat.count} {cat.count === 1 ? 'lectura' : 'lecturas'}</p>
      </header>

      <section className="grid-section container-wide">
        <div className="grid">
          {posts.map((p) => <PostCard key={p.id} post={p} />)}
        </div>
      </section>

      <style>{`
        .cat-page { padding: 32px 0 40px; }
        .cat-header { padding: 32px 24px; text-align: center; }
        .back-link {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--cobalto);
          opacity: 0.7;
          padding: 8px 12px;
          display: inline-block;
          margin-bottom: 18px;
        }
        .cat-header .eyebrow { color: var(--cobalto); margin-bottom: 14px; opacity: 1; }
        .cat-title {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 700;
          font-size: clamp(36px, 7vw, 56px);
          line-height: 1.1;
          color: var(--ink);
          margin-bottom: 14px;
        }
        .cat-desc {
          max-width: 520px;
          margin: 0 auto 12px;
          font-size: 16px;
          opacity: 0.78;
          line-height: 1.55;
        }
        .cat-count {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink);
          opacity: 0.5;
        }
        .grid-section { padding: 32px 24px; }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 22px;
        }
      `}</style>
    </div>
  );
}
