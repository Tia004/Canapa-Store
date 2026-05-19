import type { Metadata } from 'next';
import { Anybody, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const anybody = Anybody({
  subsets: ['latin'],
  weight: ['400', '700', '800', '900'],
  variable: '--font-anybody',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Canapa Store — Qualità Botanica Premium',
  description: 'Scopri la selezione premium di canapa light, oli CBD e prodotti per il benessere. Energia naturale, design brutale. Spedizioni in tutta Italia.',
  keywords: ['canapa light', 'CBD', 'olio CBD', 'fiori CBD', 'canapa legale', 'benessere naturale'],
  openGraph: {
    title: 'Canapa Store — Qualità Botanica Premium',
    description: 'Energia naturale, design brutale. La tua destinazione per prodotti CBD di alta qualità.',
    type: 'website',
    locale: 'it_IT',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={`${anybody.variable} ${plusJakartaSans.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
