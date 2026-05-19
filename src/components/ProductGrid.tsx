'use client';

interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  imageUrl: string;
  badge?: string;
  badgePosition?: 'left' | 'right';
  badgeStyle?: 'lime' | 'orange';
  bgColor?: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'gummies-cbd',
    name: 'Gummies CBD',
    description: 'Energia pulita per la tua giornata.',
    price: '€24.90',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1EfwL4Iy-qfpEtPg7m8T-GkiKMJyITPeyn7eYML0AC7_7H80Ud4J72U9GUaQ_WaEcrRWKRvPFVbFFBq8S5YVmI1fAt-apEXsDTNf0iNItvSvzSnr_PB5A2fGHbyVeULntrNSZRQLWN2F1Z_FAYHw2MTeWdPElVK1tmr2fHhc6SWUvfXsHxDqHebujwTloT7WmzRj3Fh8ybKaxvIOP7pZ5TgHTF3P81vs-1FNEFdn_VaNJEYUDnkudQ3I_juim9XZob3zcy0_hkw0',
    badge: 'PIÙ VENDUTO',
    badgePosition: 'left',
    badgeStyle: 'lime',
    bgColor: 'var(--color-background)',
  },
  {
    id: 'crema-viso',
    name: 'Crema Viso',
    description: 'Idratazione profonda con estratti naturali.',
    price: '€35.00',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAySqKQXtTBuNbv01yExHiSywuZSwxl4h8d4EdCq1JPgKH7FH_WRMa6D75hmw6vbOT_WNbQPL_LsCDOCrkEn7DrAyiCTVbST7FPj6cHVxKyPEQIuKaR_2X7VVjGAlnEd43KGarcV7mNukqDIpnOFhGgRkiaSieGP6wm7pCdnPM8Sj9lhqxaCqdp-lkhlWfJc0HuWhc2oLmBoJ3_ysySOCFN7_Y1CydjgU8Q2l58f5lrVLGdgFD3NlNJcgHkOzg0kYeOdQfhs2OKhjE',
    badge: 'NOVITÀ',
    badgePosition: 'right',
    badgeStyle: 'orange',
    bgColor: 'var(--color-surface-dim)',
  },
  {
    id: 'lemon-haze',
    name: 'Lemon Haze',
    description: 'Aroma agrumato, relax totale.',
    price: '€12.50/g',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvEoWAvcXYfQrAFohRnaFg68FSbjQp6d9CAQGhZpIGy1eRWwQ7hJ3npEurBkWzqTano1obU8xNI2-pDhnAuQGOuoFV2lIKTleqpElMiMAt9IXhM6fwHJ4oPDY98kTZO1CzPlMKWRXwk97gjzoZFrKTOfpFYTBTZQzM6VaGdd788MFT77X6wTmbRD860t55DZMzJ3vTp0Noojnb_EX9i9enGX1jp0q9eYKAtGRP6AYwnvnbRffHYws_y8Hc7mAwDqnOvJAUgW4jrUQ',
    bgColor: 'var(--color-tertiary-fixed)',
  },
];

export default function ProductGrid() {
  return (
    <section
      className="px-8 py-32 border-t-2 border-(--color-primary)"
      style={{ backgroundColor: 'var(--color-surface-variant)' }}
    >
      {/* Section Heading */}
      <div className="text-center mb-12">
        <h2
          className="text-headline-lg uppercase inline-block brutalist-border brutalist-shadow px-8 py-2 -rotate-2"
          style={{
            backgroundColor: 'var(--color-acid-lime)',
            color: 'var(--color-primary)',
          }}
        >
          In Evidenza
        </h2>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {PRODUCTS.map((product) => (
          <article
            key={product.id}
            className="brutalist-border brutalist-shadow hover-lift flex flex-col p-6 group cursor-pointer"
            style={{ backgroundColor: product.bgColor }}
          >
            {/* Image Container */}
            <div
              className="h-64 mb-6 flex items-center justify-center brutalist-border relative overflow-hidden transition-colors duration-300"
              style={{ backgroundColor: 'var(--color-surface-container-high)' }}
            >
              {product.badge && (
                <span
                  className={`absolute top-4 ${product.badgePosition === 'right' ? 'right-4' : 'left-4'} text-label-bold uppercase px-3 py-1 brutalist-border z-10`}
                  style={{
                    backgroundColor: product.badgeStyle === 'lime' ? 'var(--color-acid-lime)' : 'var(--color-neo-orange)',
                    color: 'var(--color-primary)',
                  }}
                >
                  {product.badge}
                </span>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <h3
              className="uppercase mb-2"
              style={{
                fontFamily: 'var(--font-anybody)',
                fontSize: '28px',
                fontWeight: 800,
                color: 'var(--color-primary)',
              }}
            >
              {product.name}
            </h3>
            <p className="text-body-md flex-grow mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
              {product.description}
            </p>

            {/* Price + CTA */}
            <div className="flex justify-between items-center mt-auto border-t-2 pt-4" style={{ borderColor: 'var(--color-primary)' }}>
              <span
                style={{
                  fontFamily: 'var(--font-anybody)',
                  fontSize: '32px',
                  fontWeight: 800,
                  color: 'var(--color-neo-orange)',
                }}
              >
                {product.price}
              </span>
              <button
                id={`add-to-cart-${product.id}`}
                className="brutalist-border brutalist-shadow active-press text-label-bold uppercase px-6 py-3 transition-colors hover:opacity-80"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-on-primary)',
                }}
                aria-label={`Aggiungi ${product.name} al carrello`}
              >
                AGGIUNGI AL CARRELLO
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* CTA row */}
      <div className="flex flex-col sm:flex-row gap-5 justify-center mt-16">
        <a
          href="/prodotti"
          className="brutalist-border brutalist-shadow-lg active-press px-10 py-5 text-label-bold uppercase text-center"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)', fontFamily: 'var(--font-anybody)', fontSize: '16px', display: 'inline-block' }}
        >
          Scopri tutti i prodotti
        </a>
        <button
          id="cta-newsletter-scroll"
          className="brutalist-border brutalist-shadow active-press px-10 py-5 text-label-bold uppercase"
          style={{ backgroundColor: 'var(--color-acid-lime)', color: 'var(--color-primary)', fontFamily: 'var(--font-anybody)', fontSize: '16px' }}
          onClick={() => document.getElementById('newsletter-section')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Iscriviti alla newsletter
        </button>
      </div>
    </section>
  );
}
