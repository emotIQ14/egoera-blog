import type { Metadata, Viewport } from 'next';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://blog.egoera.es'),
  title: {
    default: 'Egoera Blog · Psicología, despacio.',
    template: '%s · Egoera Blog',
  },
  description:
    'Lecturas sobre psicología, regulación emocional, vínculos y autoconocimiento. Sin tecnicismos vacíos, sin atajos.',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://blog.egoera.es',
    siteName: 'Egoera Blog',
    title: 'Egoera Blog · Psicología, despacio.',
    description: 'Lecturas sobre psicología, regulación emocional y vínculos.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Egoera Blog',
    description: 'Psicología, despacio.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f1ead8' },
    { media: '(prefers-color-scheme: dark)', color: '#0d0f3d' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500;1,9..144,600;1,9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Nav />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
