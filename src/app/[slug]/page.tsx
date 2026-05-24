import { getPostBySlug, getAllPostSlugs, estimateReadingMinutes, decodeHtmlEntities, cleanExcerpt } from '@/lib/wp';
import PostBody from '@/components/PostBody';
import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const slugs = await getAllPostSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Lectura no encontrada' };

  const title = decodeHtmlEntities(post.title.rendered);
  const description = cleanExcerpt(post.excerpt.rendered, 160);
  const ogImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return {
    title,
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/${slug}`,
      publishedTime: post.date,
      modifiedTime: post.modified,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const title = decodeHtmlEntities(post.title.rendered);
  const mins = estimateReadingMinutes(post.content.rendered);
  const featured = post._embedded?.['wp:featuredmedia']?.[0];
  const category = post._embedded?.['wp:term']?.[0]?.[0];
  const author = post._embedded?.author?.[0];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    datePublished: post.date,
    dateModified: post.modified,
    author: { '@type': 'Person', name: author?.name ?? 'Ander Bilbao Castejón', url: 'https://egoera.es/ander-bilbao/' },
    publisher: { '@type': 'Organization', name: 'Egoera Psikología', logo: { '@type': 'ImageObject', url: 'https://egoera.es/favicon.ico' } },
    image: featured?.source_url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://blog.egoera.es/${slug}` },
    inLanguage: 'es-ES',
  };

  return (
    <article className="post-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="post-header container">
        <Link href="/" className="back-link">← Todas las lecturas</Link>
        <div className="post-meta">
          {category && <Link href={`/categoria/${category.slug}`} className="pill pill-soft">{category.name}</Link>}
          <span className="post-mins">{mins} min de lectura</span>
        </div>
        <h1 className="post-title">{title}</h1>
        <p className="post-byline">
          <span>{formatDate(post.date)}</span>
          {author && (
            <>
              <span aria-hidden> · </span>
              <a href="https://egoera.es/ander-bilbao/" rel="noopener">{author.name}</a>
            </>
          )}
        </p>
      </header>

      {featured && (
        <div className="post-hero container-wide">
          <img src={featured.source_url} alt={featured.alt_text || title} loading="eager" />
        </div>
      )}

      <div className="post-body-wrap container">
        <PostBody html={post.content.rendered} />
      </div>

      <section className="post-after container">
        <div className="cta-card">
          <p className="eyebrow">— Si esto te ha tocado —</p>
          <h3>Anótalo en tu diario emocional.</h3>
          <p>Lo que sientas mientras lees también es información. Egoera Diario te ayuda a no soltarlo.</p>
          <a href="https://diario.egoera.es" className="btn btn-cobalto" rel="noopener">Abrir el diario →</a>
        </div>
      </section>

      <style>{`
        .post-page { padding: 24px 0 40px; }
        .post-header { padding: 24px; text-align: center; }
        .back-link {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--cobalto);
          opacity: 0.7;
          padding: 8px 12px;
          display: inline-block;
          margin-bottom: 24px;
        }
        .back-link:hover { opacity: 1; }
        .post-meta {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
        }
        .post-mins {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink);
          opacity: 0.5;
        }
        .post-title {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 700;
          font-size: clamp(32px, 6vw, 48px);
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: var(--ink);
          margin: 12px 0 18px;
        }
        .post-byline {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink);
          opacity: 0.55;
        }
        .post-byline a { color: var(--cobalto); }

        .post-hero {
          margin: 32px auto;
          padding: 0 24px;
        }
        .post-hero img {
          width: 100%;
          max-height: 480px;
          object-fit: cover;
          border-radius: var(--r-lg);
          display: block;
        }

        .post-body-wrap {
          padding: 24px;
        }

        .post-after {
          padding: 32px 24px;
        }
        .cta-card {
          background: var(--cobalto);
          color: var(--crema);
          padding: 28px 28px 32px;
          border-radius: var(--r-lg);
          text-align: center;
        }
        .cta-card .eyebrow {
          color: var(--crema);
          opacity: 0.65;
          margin-bottom: 14px;
        }
        .cta-card h3 {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 700;
          font-size: 28px;
          line-height: 1.15;
          margin-bottom: 12px;
          color: var(--crema);
        }
        .cta-card p {
          font-size: 15px;
          line-height: 1.55;
          opacity: 0.85;
          margin-bottom: 18px;
        }
        .cta-card .btn {
          background: var(--accent);
          color: var(--crema);
        }
      `}</style>
    </article>
  );
}
