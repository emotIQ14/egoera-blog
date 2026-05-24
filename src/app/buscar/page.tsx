import { getPosts } from '@/lib/wp';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import type { Metadata } from 'next';

export const revalidate = 600; // 10 min

export const metadata: Metadata = {
  title: 'Buscar lecturas',
  description: 'Encuentra lecturas sobre psicología, regulación emocional, vínculos, apego y autoconocimiento.',
  robots: { index: false, follow: true }, // search pages no indexar
};

type Params = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Params) {
  const params = await searchParams;
  const query = (params.q ?? '').trim();

  let results = [] as Awaited<ReturnType<typeof getPosts>>;
  let error: string | null = null;

  if (query) {
    try {
      results = await getPosts({ search: query, per_page: 30 });
    } catch (e) {
      error = e instanceof Error ? e.message : 'Error desconocido';
    }
  }

  return (
    <div className="search-page">
      <header className="search-header container">
        <Link href="/" className="back-link">← Volver al blog</Link>
        <p className="eyebrow">— Búsqueda —</p>
        <h1 className="search-title">
          {query ? (
            <>Resultados para <em className="italic">«{query}»</em></>
          ) : (
            <>Encuentra una <em className="italic">lectura</em>.</>
          )}
        </h1>

        <form action="/buscar" method="get" className="search-form" role="search">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Apego, ansiedad, duelo, perfeccionismo…"
            aria-label="Buscar en el blog"
            className="search-input"
            autoFocus={!query}
          />
          <button type="submit" className="search-submit">Buscar →</button>
        </form>

        {query && (
          <p className="search-count">
            {results.length === 0
              ? 'Sin resultados'
              : `${results.length} ${results.length === 1 ? 'resultado' : 'resultados'}`}
          </p>
        )}
      </header>

      {error && (
        <section className="container">
          <p className="search-error">Hubo un problema buscando. Intenta de nuevo en un momento.</p>
        </section>
      )}

      {query && results.length === 0 && !error && (
        <section className="container search-empty">
          <p>No hay lecturas que contengan «{query}». Prueba con otra palabra:</p>
          <ul className="suggestion-list">
            <li><Link href="/buscar?q=apego">apego</Link></li>
            <li><Link href="/buscar?q=ansiedad">ansiedad</Link></li>
            <li><Link href="/buscar?q=duelo">duelo</Link></li>
            <li><Link href="/buscar?q=perfeccionismo">perfeccionismo</Link></li>
            <li><Link href="/buscar?q=rumiación">rumiación</Link></li>
            <li><Link href="/buscar?q=trauma">trauma</Link></li>
          </ul>
        </section>
      )}

      {results.length > 0 && (
        <section className="grid-section container-wide">
          <div className="grid">
            {results.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
        </section>
      )}

      <style>{`
        .search-page { padding: 32px 0 40px; }
        .search-header { padding: 24px; text-align: center; }
        .back-link {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--cobalto);
          opacity: 0.7;
          padding: 12px;
          display: inline-block;
          margin-bottom: 8px;
        }
        .search-header .eyebrow { color: var(--cobalto); margin-bottom: 14px; opacity: 1; }
        .search-title {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 700;
          font-size: clamp(28px, 6vw, 44px);
          line-height: 1.15;
          color: var(--ink);
          margin-bottom: 24px;
        }
        .search-title em { color: var(--cobalto); }
        .search-form {
          display: flex;
          gap: 8px;
          max-width: 520px;
          margin: 0 auto;
          flex-wrap: wrap;
          justify-content: center;
        }
        .search-input {
          flex: 1;
          min-width: 220px;
          min-height: 48px;
          padding: 12px 18px;
          font-family: var(--font-body);
          font-size: 15px;
          color: var(--ink);
          background: var(--crema-soft);
          border: 1.5px solid rgba(13, 15, 61, 0.12);
          border-radius: var(--r-pill);
          outline: none;
          transition: border-color 0.15s;
        }
        .search-input:focus {
          border-color: var(--cobalto);
        }
        .search-submit {
          min-height: 48px;
          padding: 12px 22px;
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          font-weight: 600;
          background: var(--ink);
          color: var(--crema);
          border: none;
          border-radius: var(--r-pill);
          cursor: pointer;
          transition: opacity 0.15s;
        }
        .search-submit:hover { opacity: 0.88; }
        .search-count {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ink);
          opacity: 0.55;
          margin-top: 18px;
        }
        .search-error {
          color: var(--accent-deep);
          padding: 18px;
          background: rgba(184, 74, 38, 0.06);
          border-radius: var(--r-md);
          text-align: center;
        }
        .search-empty {
          padding: 24px;
          text-align: center;
        }
        .search-empty p { font-size: 16px; opacity: 0.75; margin-bottom: 14px; }
        .suggestion-list {
          list-style: none;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
          padding: 0;
        }
        .suggestion-list a {
          display: inline-block;
          padding: 8px 14px;
          background: var(--crema-soft);
          border: 1px solid rgba(13, 15, 61, 0.1);
          border-radius: var(--r-pill);
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--cobalto);
          transition: background 0.15s;
        }
        .suggestion-list a:hover { background: rgba(29, 43, 219, 0.08); }
        .grid-section { padding: 24px; }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 22px;
        }
      `}</style>
    </div>
  );
}
