// Flat solid SVG icons — no emoji, no external libraries
function TruckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36" aria-hidden>
      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
    </svg>
  );
}

function FlaskIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36" aria-hidden>
      <path d="M9 3v10.55C7.21 14.26 6 16 6 18c0 2.76 2.24 5 5 5h2c2.76 0 5-2.24 5-5 0-2-1.21-3.74-3-4.45V3H9zm5 14c0 1.1-.9 2-2 2h-2c-1.1 0-2-.9-2-2 0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2zm-1-4H9V5h4v8z"/>
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36" aria-hidden>
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
    </svg>
  );
}

const FEATURES = [
  {
    id: 'spedizione',
    Icon: TruckIcon,
    title: 'SPEDIZIONE 24H',
    desc: 'Consegna rapida e pacco anonimo per la tua privacy.',
    iconBg: 'var(--color-acid-lime)',
    iconColor: 'var(--color-primary)',
  },
  {
    id: 'lab',
    Icon: FlaskIcon,
    title: 'TEST DI LAB',
    desc: 'Ogni lotto è analizzato per garantire purezza e sicurezza.',
    iconBg: 'var(--color-acid-lime)',
    iconColor: 'var(--color-primary)',
  },
  {
    id: 'legale',
    Icon: ShieldCheckIcon,
    title: '100% LEGALE',
    desc: 'Conforme alla normativa italiana. THC entro i limiti legali.',
    iconBg: 'var(--color-neo-orange)',
    iconColor: 'var(--color-on-primary)',
  },
] as const;

export default function FeatureBadges() {
  return (
    <section
      className="relative w-full overflow-hidden border-y-4 border-(--color-primary)"
      style={{ backgroundColor: 'var(--color-surface-container-low)' }}
    >
      {/* Animated grid bg */}
      <div className="absolute inset-0 pointer-events-none opacity-30 grid-bg-animated" aria-hidden />

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3">
        {FEATURES.map((f, idx) => (
          <div
            key={f.id}
            className="flex flex-col items-center text-center px-10 py-12"
            style={{
              borderRight: idx < FEATURES.length - 1 ? '4px solid var(--color-primary)' : undefined,
            }}
          >
            {/* Icon circle */}
            <div
              className="brutalist-border mb-6 p-4 inline-flex items-center justify-center"
              style={{
                backgroundColor: f.iconBg,
                color: f.iconColor,
                width: '72px',
                height: '72px',
                boxShadow: '4px 4px 0px 0px var(--color-primary)',
              }}
            >
              <f.Icon />
            </div>

            <h3
              className="uppercase mb-3"
              style={{
                fontFamily: 'var(--font-anybody)',
                fontSize: 'clamp(20px, 2.5vw, 28px)',
                fontWeight: 900,
                color: 'var(--color-primary)',
                letterSpacing: '-0.01em',
              }}
            >
              {f.title}
            </h3>
            <p
              className="text-body-md"
              style={{ color: 'var(--color-on-surface-variant)', maxWidth: '260px' }}
            >
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
