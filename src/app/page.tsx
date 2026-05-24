import { getPosts, getCategories } from '@/lib/wp';
import PostCard from '@/components/PostCard';
import Link from 'next/link';

export const revalidate = 3600;

export default async function HomePage() {
  const [posts, categories] = await Promise.all([
    getPosts({ per_page: 12 }),
    getCategories(),
  ]);

  const [featured, ...rest] = posts;
  const topCategories = categories.filter((c) => c.count > 0).slice(0, 6);

  return (
    <div className="home">
      <section className="hero container">
        <p className="eyebrow">— Egoera Blog —</p>
        <h1 className="hero-title">
          Psicología, <em className="italic">despacio</em>.
        </h1>
        <p className="hero-lede">
          Lecturas sobre regulación emocional, vínculos, apego, ansiedad y autoconocimiento.
          Escritas por <Link href="https://egoera.es/ander-bilbao/">Ander Bilbao</Link>, psicólogo.
          Sin tecnicismos vacíos, sin atajos.
        </p>
      </section>

      {topCategories.length > 0 && (
        <section className="categories container" aria-label="Categorías">
          <ul className="cat-list">
            {topCategories.map((c) => (
              <li key={c.id}>
                <Link href={`/categoria/${c.slug}`} className="cat-chip">
                  {c.name} <span className="cat-count">{c.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {featured && (
        <section className="featured container" aria-label="Última lectura">
          <PostCard post={featured} featured />
        </section>
      )}

      {rest.length > 0 && (
        <section className="grid-section container-wide" aria-label="Lecturas anteriores">
          <p className="eyebrow grid-eyebrow">
            — Anteriores · {rest.length} {rest.length === 1 ? 'lectura' : 'lecturas'} —
          </p>
          <div className="grid">
            {rest.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          {/* CTA al hub para descubrir más, ya que aún no hay paginación */}
          <div className="grid-more">
            <Link href="/categoria/regulacion-emocional" className="grid-more-link">
              Explorar por categoría →
            </Link>
          </div>
        </section>
      )}

      <style>{`
        .home { padding: 0 0 40px; }
        .hero {
          padding: 40px 24px 24px;
          text-align: center;
        }
        @media (min-width: 768px) {
          .hero { padding: 80px 24px 40px; }
        }
        .hero .eyebrow { color: var(--cobalto); margin-bottom: 18px; opacity: 1; }
        .hero-title {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 700;
          font-size: clamp(34px, 8vw, 64px);
          line-height: 1.05;
          letter-spacing: -0.02em;
          color: var(--ink);
          margin-bottom: 16px;
        }
        .hero-lede {
          margin-top: 6px;
        }
        .hero-title em { color: var(--cobalto); }
        .hero-lede {
          font-family: var(--font-body);
          font-size: 17px;
          line-height: 1.6;
          color: var(--ink);
          opacity: 0.8;
          max-width: 560px;
          margin: 0 auto;
        }
        .hero-lede a {
          color: var(--cobalto);
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .categories { padding: 24px 24px 8px; }
        .cat-list {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          justify-content: center;
        }
        .cat-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 12px 16px;
          min-height: 44px;
          background: var(--crema-soft);
          border: 1px solid rgba(13, 15, 61, 0.08);
          border-radius: var(--r-pill);
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 500;
          color: var(--ink);
          transition: background 0.15s, border-color 0.15s;
        }
        .cat-chip:hover {
          background: rgba(29, 43, 219, 0.06);
          border-color: rgba(29, 43, 219, 0.2);
        }
        .cat-count {
          font-size: 9px;
          /* WCAG: rgba alpha 0.7 sobre crema-dark da ≥4.5:1 */
          color: rgba(13, 15, 61, 0.75);
          background: var(--crema-dark);
          padding: 1px 6px;
          border-radius: var(--r-pill);
        }

        .featured { padding: 32px 24px; }

        .grid-section { padding: 48px 24px; }
        .grid-eyebrow {
          /* WCAG: ratio 4.5:1 sobre crema */
          color: rgba(13, 15, 61, 0.72);
          margin-bottom: 20px;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 22px;
        }

        /* CTA "explorar más" al final del grid */
        .grid-more {
          margin-top: 32px;
          text-align: center;
        }
        .grid-more-link {
          display: inline-block;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--cobalto);
          padding: 14px 22px;
          border: 1px dashed rgba(29, 43, 219, 0.3);
          border-radius: var(--r-pill);
          transition: background 0.15s, border-color 0.15s;
        }
        .grid-more-link:hover {
          background: rgba(29, 43, 219, 0.06);
          border-color: var(--cobalto);
        }
      `}</style>
    </div>
  );
}
