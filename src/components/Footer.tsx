import Link from 'next/link';

const LEGAL_LINKS = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/termini', label: 'Termini e Condizioni' },
  { href: '/spedizioni', label: 'Info Spedizioni' },
  { href: '/laboratorio', label: 'Test di Laboratorio' },
];

const EXPLORE_LINKS = [
  { href: '/canapa-light', label: 'Canapa Light' },
  { href: '/cbd', label: 'CBD' },
  { href: '/cosmesi', label: 'Cosmesi' },
  { href: '/abbigliamento', label: 'Abbigliamento' },
  { href: '/accessori', label: 'Accessori' },
  { href: '/offerte', label: 'Offerte' },
  { href: '/blog', label: 'Blog' },
];

const SOCIAL_LINKS = [
  { href: 'https://instagram.com', label: 'Instagram' },
  { href: 'https://facebook.com', label: 'Facebook' },
  { href: 'https://t.me', label: 'Telegram' },
];

export default function Footer() {
  return (
    <footer
      className="pt-20 pb-10 px-8 w-full overflow-hidden border-t-8 border-(--color-primary)"
      style={{ backgroundColor: 'var(--color-deep-green)', color: 'var(--color-surface-container-lowest)' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col items-center">

        {/* Links */}
        <div
          className="w-full flex flex-wrap justify-between items-start gap-12 mb-20 border-b-2 pb-16"
          style={{ borderColor: 'rgba(255,255,255,0.2)' }}
        >
          {/* Legal */}
          <div className="flex flex-col gap-6 max-w-sm">
            <h4
              className="text-label-bold uppercase tracking-widest border-l-4 pl-4"
              style={{ fontSize: '20px', color: 'var(--color-acid-lime)', borderColor: 'var(--color-acid-lime)' }}
            >
              Legale &amp; Info
            </h4>
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-label-bold uppercase transition-colors hover:opacity-70"
                style={{ color: 'var(--color-surface-container-lowest)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Explore */}
          <div className="flex flex-col gap-6 max-w-sm">
            <h4
              className="text-label-bold uppercase tracking-widest border-l-4 pl-4"
              style={{ fontSize: '20px', color: 'var(--color-acid-lime)', borderColor: 'var(--color-acid-lime)' }}
            >
              Esplora
            </h4>
            {EXPLORE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-label-bold uppercase transition-colors hover:opacity-70"
                style={{ color: 'var(--color-surface-container-lowest)' }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Social */}
          <div className="flex flex-col gap-6 max-w-sm">
            <h4
              className="text-label-bold uppercase tracking-widest border-l-4 pl-4"
              style={{ fontSize: '20px', color: 'var(--color-acid-lime)', borderColor: 'var(--color-acid-lime)' }}
            >
              Social
            </h4>
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-label-bold uppercase transition-colors hover:opacity-70 flex items-center gap-2"
                style={{ color: 'var(--color-surface-container-lowest)' }}
              >
                {link.label}
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>north_east</span>
              </a>
            ))}
          </div>
        </div>

        {/* Divider with leaf SVG */}
        <div className="w-full flex items-center justify-center mb-12">
          <div className="h-px w-full" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <div className="px-8" style={{ color: 'var(--color-acid-lime)' }}>
            <svg
              className="w-16 h-16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
            </svg>
          </div>
          <div className="h-px w-full" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
        </div>

        {/* Massive wordmark — single line, full width */}
        <h2
          className="leading-none font-black uppercase text-center w-full"
          style={{
            fontFamily: 'var(--font-anybody)',
            fontSize: 'min(12.5vw, 180px)',
            letterSpacing: '-0.04em',
            color: 'var(--color-surface-container-lowest)',
            whiteSpace: 'nowrap',
          }}
        >
          CANAPASTORE.IT
        </h2>

        {/* Copyright */}
        <div className="mt-10 text-center border-t-2 pt-8 w-full" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <p
            className="text-label-bold uppercase tracking-widest"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            © 2026 CANAPASTORE.IT — TUTTI I DIRITTI RISERVATI. COLTIVATO ETICAMENTE. VIETATA LA VENDITA AI MINORI DI 18 ANNI.
          </p>
        </div>
      </div>
    </footer>
  );
}
