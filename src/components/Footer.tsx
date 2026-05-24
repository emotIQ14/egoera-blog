export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer" role="contentinfo">
      <div className="container-wide footer-inner">
        <div className="foot-col">
          <p className="eyebrow">— Egoera —</p>
          <p className="foot-tagline">
            Psicología, <em className="italic">despacio</em>.
          </p>
        </div>
        <nav className="foot-col foot-links" aria-label="Productos de Egoera">
          <p className="eyebrow">— Espacios —</p>
          <ul>
            <li><a href="https://egoera.es" rel="noopener">egoera.es · hub</a></li>
            <li><a href="https://blog.egoera.es" rel="noopener">blog.egoera.es · lecturas</a></li>
            <li><a href="https://diario.egoera.es" rel="noopener">diario.egoera.es · diario emocional</a></li>
          </ul>
        </nav>
        <nav className="foot-col foot-links" aria-label="Enlaces de utilidad">
          <p className="eyebrow">— Información —</p>
          <ul>
            <li><a href="https://egoera.es/ander-bilbao/" rel="noopener">Sobre Ander</a></li>
            <li><a href="https://egoera.es/sobre-nosotros/" rel="noopener">Sobre Egoera</a></li>
            <li><a href="https://egoera.es/recursos/" rel="noopener">Recursos</a></li>
          </ul>
        </nav>
      </div>
      <div className="foot-copy container-wide">
        © {year} · Egoera Psikología · Ander Bilbao Castejón
      </div>
      <style>{`
        .footer {
          background: var(--ink);
          color: var(--crema);
          margin-top: 80px;
          padding: 56px 0 32px;
        }
        .footer-inner {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr;
          gap: 40px;
          padding-bottom: 40px;
          border-bottom: 1px solid rgba(241, 234, 216, 0.1);
        }
        .foot-col .eyebrow {
          color: var(--crema);
          margin-bottom: 14px;
        }
        .foot-tagline {
          font-family: var(--font-display);
          font-size: 24px;
          line-height: 1.2;
          color: var(--crema);
        }
        .foot-tagline em { color: var(--accent); }
        .foot-links ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .foot-links a {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--crema);
          opacity: 0.78;
          transition: opacity 0.15s;
        }
        .foot-links a:hover { opacity: 1; }
        .foot-copy {
          font-family: var(--font-mono);
          font-size: 10px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0.5;
          padding-top: 24px;
        }
        @media (max-width: 720px) {
          .footer-inner {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>
    </footer>
  );
}
