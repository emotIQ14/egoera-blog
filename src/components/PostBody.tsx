/**
 * Renderiza el HTML del post de WP en un contenedor con estilos tipográficos
 * que respetan la jerarquía editorial (H2, H3, blockquote, listas).
 */
export default function PostBody({ html }: { html: string }) {
  return (
    <>
      <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />
      <style>{`
        .post-body {
          font-family: var(--font-body);
          font-size: 17px;
          line-height: 1.7;
          color: var(--ink);
        }
        .post-body p {
          margin: 0 0 1.4em;
        }
        .post-body h2 {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 700;
          font-size: 28px;
          line-height: 1.2;
          letter-spacing: -0.01em;
          color: var(--ink);
          margin: 2.2em 0 0.8em;
        }
        .post-body h2 em { color: var(--cobalto); }
        .post-body h3 {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 600;
          font-size: 22px;
          line-height: 1.25;
          color: var(--ink);
          margin: 1.8em 0 0.6em;
        }
        .post-body a {
          color: var(--cobalto);
          text-decoration: underline;
          text-decoration-thickness: 1px;
          text-underline-offset: 3px;
          transition: color 0.15s;
        }
        .post-body a:hover { color: var(--cobalto-deep); }
        .post-body strong { font-weight: 700; }
        .post-body em { font-style: italic; }
        .post-body blockquote {
          margin: 1.8em 0;
          padding: 18px 24px;
          border-left: 3px solid var(--accent);
          background: rgba(230, 100, 58, 0.06);
          border-radius: 0 var(--r-md) var(--r-md) 0;
          font-family: var(--font-display);
          font-style: italic;
          font-size: 19px;
          line-height: 1.5;
          color: var(--ink);
        }
        .post-body blockquote p { margin-bottom: 0; }
        .post-body ul, .post-body ol {
          margin: 1em 0 1.4em 1.4em;
        }
        .post-body li {
          margin-bottom: 0.5em;
        }
        .post-body img {
          max-width: 100%;
          height: auto;
          border-radius: var(--r-md);
          margin: 1.8em 0;
        }
        .post-body figure {
          margin: 1.8em 0;
        }
        .post-body figcaption {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink);
          opacity: 0.5;
          margin-top: 8px;
          text-align: center;
        }
        .post-body hr {
          border: none;
          border-top: 1px solid rgba(13, 15, 61, 0.12);
          margin: 2.5em 0;
        }
        .post-body code {
          font-family: var(--font-mono);
          font-size: 0.92em;
          background: rgba(29, 43, 219, 0.08);
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--cobalto-deep);
        }
        .post-body pre {
          background: var(--ink);
          color: var(--crema);
          padding: 18px 22px;
          border-radius: var(--r-md);
          overflow-x: auto;
          margin: 1.8em 0;
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 1.5;
        }
        .post-body pre code {
          background: transparent;
          color: inherit;
          padding: 0;
        }
        /* Schema FAQ (los posts de Egoera usan dl/dt/dd al final a veces) */
        .post-body dl { margin: 1.4em 0; }
        .post-body dt {
          font-family: var(--font-display);
          font-weight: 700;
          font-size: 18px;
          margin-top: 1em;
        }
        .post-body dd { margin: 0 0 1em; opacity: 0.85; }
      `}</style>
    </>
  );
}
