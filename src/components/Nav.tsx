import Link from 'next/link';

export default function Nav() {
  return (
    <header className="nav-shell">
      <nav className="nav container-wide" aria-label="Navegación principal">
        <Link href="/" className="brand">
          <span className="brand-name">Egoera</span>
          <span className="brand-sub">Blog</span>
        </Link>
        <ul className="nav-links">
          <li>
            <a href="https://egoera.es" rel="noopener">Hub</a>
          </li>
          <li>
            <Link href="/">Blog</Link>
          </li>
          <li>
            <a href="https://diario.egoera.es" rel="noopener">Diario</a>
          </li>
        </ul>
      </nav>
      <style>{`
        .nav-shell {
          background: var(--crema);
          border-bottom: 1px solid rgba(13, 15, 61, 0.06);
          position: sticky;
          top: 0;
          z-index: 40;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
        }
        .brand {
          display: inline-flex;
          align-items: baseline;
          gap: 8px;
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 700;
        }
        .brand-name {
          font-size: 22px;
          color: var(--ink);
        }
        .brand-sub {
          font-family: var(--font-mono);
          font-style: normal;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--cobalto);
          font-weight: 600;
        }
        .nav-links {
          list-style: none;
          display: flex;
          gap: 22px;
          align-items: center;
        }
        .nav-links a {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--ink);
          opacity: 0.7;
          transition: opacity 0.15s;
          padding: 10px 6px;
          display: inline-block;
        }
        .nav-links a:hover { opacity: 1; }
        @media (max-width: 540px) {
          .nav { padding: 12px 16px; }
          .nav-links { gap: 14px; }
          .nav-links a { font-size: 10px; }
        }
      `}</style>
    </header>
  );
}
