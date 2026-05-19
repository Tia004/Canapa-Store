export default function HeroSection() {
  return (
    <section
      className="relative min-h-[819px] flex flex-col items-center justify-center px-8 py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      {/* Grid Background — animated */}
      <div className="absolute inset-0 pointer-events-none opacity-20 grid-bg-animated" aria-hidden />

      {/* Content */}
      <div className="z-10 text-center max-w-5xl relative mt-16 md:mt-0">
        <h1
          className="uppercase mb-6 leading-none"
          style={{
            fontFamily: 'var(--font-anybody)',
            fontSize: 'clamp(40px, 8vw, 80px)',
            fontWeight: 900,
            color: 'var(--color-primary)',
            letterSpacing: '-0.02em',
          }}
        >
          IL FUTURO DELLA CANAPA È{' '}
          <span
            className="inline-block px-4 py-1 brutalist-border brutalist-shadow ml-2 -rotate-3 hover:rotate-0 transition-transform cursor-default"
            style={{
              backgroundColor: 'var(--color-acid-lime)',
              color: 'var(--color-primary)',
            }}
          >
            QUI
          </span>
        </h1>

        <p
          className="text-body-lg max-w-2xl mx-auto mb-10 brutalist-border inline-block px-4 py-4"
          style={{
            color: 'var(--color-on-surface-variant)',
            backgroundColor: 'rgba(232, 255, 239, 0.8)',
          }}
        >
          Scopri la selezione premium di fiori, oli CBD e prodotti per il benessere. Energia naturale, design brutale.
        </p>

        <div>
          <button
            id="hero-cta"
            className="brutalist-border brutalist-shadow-lg active-press transition-all uppercase px-12 py-5 text-headline-lg-mobile hover:opacity-80"
            style={{
              backgroundColor: 'var(--color-neo-orange)',
              color: 'var(--color-primary-container)',
            }}
          >
            Esplora
          </button>
        </div>
      </div>

      {/* Decorative CBD Oil image on the left */}
      <div
        className="absolute left-[-2%] bottom-[-5%] w-[45vw] max-w-[550px] pointer-events-none -rotate-6 z-0 hidden md:block"
        style={{ filter: 'drop-shadow(-24px 24px 0px var(--color-neo-orange))' }}
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Olio CBD Canapa"
          src="/cbd-oil.webp"
          className="w-full h-auto object-contain"
        />
      </div>

      {/* Decorative flower image */}
      <div
        className="absolute right-[-5%] bottom-[-10%] w-[60vw] max-w-[800px] pointer-events-none rotate-6 z-0 hidden md:block"
        style={{ filter: 'drop-shadow(24px 24px 0px var(--color-primary))' }}
        aria-hidden
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Fiore di Canapa THC"
          src="/thcflower.webp"
          className="w-full h-auto object-contain"
        />
      </div>
    </section>
  );
}
