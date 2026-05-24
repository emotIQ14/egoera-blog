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

export default function PostCard({ post, featured = false }: { post: WPPost; featured?: boolean }) {
  const title = decodeHtmlEntities(post.title.rendered);
  const excerpt = cleanExcerpt(post.excerpt.rendered, featured ? 220 : 140);
  const mins = estimateReadingMinutes(post.content.rendered);
  const category = post._embedded?.['wp:term']?.[0]?.[0];
  const featuredImg = post._embedded?.['wp:featuredmedia']?.[0];

  return (
    <article className={`post-card ${featured ? 'post-card-featured' : ''}`}>
      <Link href={`/${post.slug}`} className="post-card-link">
        {featuredImg && (
          <div className="post-card-image">
            <img
              src={featuredImg.source_url}
              alt={featuredImg.alt_text || title}
              loading={featured ? 'eager' : 'lazy'}
            />
          </div>
        )}
        <div className="post-card-body">
          <div className="post-card-meta">
            {category && <span className="pill pill-soft">{category.name}</span>}
            <span className="post-card-mins">{mins} min</span>
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
        .post-card-title {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 700;
          font-size: 22px;
          line-height: 1.18;
          letter-spacing: -0.01em;
          color: var(--ink);
          margin-bottom: 10px;
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
