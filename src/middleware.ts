import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Egoera 5.0 — Fase 0 (triage SEO, 31 may 2026)
// blog.egoera.es duplicaba el vlog de egoera.es (mismos slugs) y canibalizaba SEO.
// Se consolida con 301 permanentes hacia el dominio canónico egoera.es.
// Mapeo verificado en vivo:
//   /                       -> egoera.es/
//   /buscar                 -> egoera.es/blog/        (WP no tiene /buscar → 404)
//   /categoria/<slug>       -> egoera.es/category/<slug>/   (WP usa /category/, en inglés)
//   /<slug> (artículos)     -> egoera.es/<slug>/       (mismo slug, con barra final)
const TARGET = 'https://egoera.es';

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  let dest: string;
  if (pathname === '/' || pathname === '') {
    dest = `${TARGET}/`;
  } else if (pathname === '/buscar' || pathname === '/buscar/') {
    dest = `${TARGET}/blog/`;
  } else if (pathname.startsWith('/categoria/')) {
    const slug = pathname.replace(/^\/categoria\//, '').replace(/\/+$/, '');
    dest = slug ? `${TARGET}/category/${slug}/` : `${TARGET}/blog/`;
  } else {
    const clean = pathname.replace(/\/+$/, '');
    dest = `${TARGET}${clean}/`;
  }

  return NextResponse.redirect(dest + (search ?? ''), 301);
}

export const config = {
  // Redirige todo salvo internos de Next y robots/sitemap (se dejan vivos para
  // que Googlebot pueda rastrear el sitemap y descubrir los 301 de cada URL).
  matcher: ['/((?!_next/|favicon.ico|robots.txt|sitemap.xml).*)'],
};
