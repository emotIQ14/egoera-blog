import Link from 'next/link';
import type { WPPost } from '@/lib/wp';
import { cleanExcerpt, decodeHtmlEntities, estimateReadingMinutes } from '@/lib/wp';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Glyphs visuales por categoría (sin fontawesome, simbolos unicode minimalistas)
const CATEGORY_GLYPHS: Record<string, string> = {
  'regulacion-emocional': '◌',
  'relaciones-apego': '◐',
  'autoconocimiento': '◈',
  'limites-asertividad': '◑',
  'desmitificacion': '◇',
  'psicologia-cotidiana': '◉',
};

export default function PostCard({ post, featured = false }: { post: WPPost; featured?: boolean }) {
  const title = decodeHtmlEntities(post.title.rendered);
  const excerpt = cleanExcerpt(post.excerpt.rendered, featured ? 220 : 140);
  const mins = estimateReadingMinutes(post.content.rendered);
  const isShort = mins <= 2;
  const category = post._embedded?.['wp:term']?.[0]?.[0];
  const featuredImg = post._embedded?.['wp:featuredmedia']?.[0];
  const glyph = category ? (CATEGORY_GLYPHS[category.slug] ?? '◌') : '◌';

  return (
    <article className={`post-card ${featured ? 'post-card-featured' : ''}`}>
      <Link href={`/${post.slug}`} className="post-card-link">
        {featuredImg ? (
          <div className="post-card-image">
            <img
              src={featuredImg.source_url}
              alt={featuredImg.alt_text || title}
              loading={featured ? 'eager' : 'lazy'}
            />
          </div>
        ) : (
          <div className="post-card-placeholder" aria-hidden="true">
            <span className="placeholder-glyph">{glyph}</span>
            {category && (
              <span className="placeholder-cat">{category.name}</span>
            )}
          </div>
        )}
        <div className="post-card-body">
          <div className="post-card-meta">
            {category && <span className="pill pill-soft">{category.name}</span>}
            {isShort ? (
              <span className="post-card-mins post-card-mins-short">Lectura corta</span>
            ) : (
              <span className="post-card-mins">{mins} min</span>
            )}
          </div>
          <h2 className="post-card-title">{title}</h2>
          {excerpt && <p className="post-card-excerpt">{excerpt}</p>}
          <div className="post-card-footer">
            <span className="post-card-date">{formatDate(post.date)}</span>
            <span className="post-card-arrow" aria-hidden>→</span>
          </div>
        </div>
      </Link>
      <style>{`
        .post-card {
          background: var(--crema-soft);
          border: 1px solid rgba(13, 15, 61, 0.06);
          border-radius: var(--r-lg);
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
        }
        .post-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
          border-color: rgba(29, 43, 219, 0.18);
        }
        .post-card-link {
          display: block;
          color: inherit;
        }
        .post-card-image {
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: var(--crema-dark);
        }
        .post-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        /* Placeholder cuando no hay featured image */
        .post-card-placeholder {
          aspect-ratio: 16 / 9;
          background: linear-gradient(135deg, var(--cobalto) 0%, var(--cobalto-deep) 100%);
          color: var(--crema);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          position: relative;
          overflow: hidden;
        }
        .post-card-placeholder::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 280px;
          height: 280px;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(230, 100, 58, 0.18) 0%, transparent 60%);
        }
        .placeholder-glyph {
          font-family: var(--font-display);
          font-size: 72px;
          line-height: 1;
          color: var(--crema);
          opacity: 0.92;
          position: relative;
        }
        .placeholder-cat {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 600;
          color: var(--crema);
          opacity: 0.7;
          position: relative;
        }
        .post-card-featured .post-card-placeholder {
          aspect-ratio: 21 / 9;
        }
        .post-card-featured .placeholder-glyph {
          font-size: 96px;
        }
        .post-card-body {
          padding: 20px 22px 22px;
        }
        .post-card-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }
        .post-card-mins {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          opacity: 0.5;
        }
        .post-card-mins-short {
          color: var(--accent);
          opacity: 0.95;
          font-weight: 600;
        }
        .post-card-title {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 700;
          font-size: 22px;
          line-height: 1.18;
          letter-spacing: -0.01em;
          color: var(--ink);
          margin-bottom: 10px;
          /* Line clamp para títulos largos */
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .post-card-featured .post-card-title {
          -webkit-line-clamp: 4;
        }
        .post-card-excerpt {
          font-family: var(--font-body);
          font-size: 14px;
          line-height: 1.55;
          color: var(--ink);
          opacity: 0.74;
          margin-bottom: 16px;
        }
        .post-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .post-card-date {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          opacity: 0.5;
        }
        .post-card-arrow {
          color: var(--cobalto);
          font-size: 18px;
          transition: transform 0.15s;
        }
        .post-card:hover .post-card-arrow {
          transform: translateX(4px);
        }

        /* Featured variant */
        .post-card-featured .post-card-title {
          font-size: 30px;
        }
        .post-card-featured .post-card-image {
          aspect-ratio: 21 / 9;
        }
      `}</style>
    </article>
  );
}
