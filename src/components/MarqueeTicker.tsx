'use client';

const TICKER_TEXT = 'STILE SENZA COMPROMESSI /// POTENZA BOTANICA /// ALTA QUALITÀ /// COLTIVAZIONE ETICA /// NATURA AD ALTO IMPATTO ///';

export default function MarqueeTicker() {
  // Duplicate 6x for rich seamless loop that spans wider screens easily
  const repeated = Array(6).fill(TICKER_TEXT);

  return (
    <div
      className="w-full bg-neo-orange border-b-2 border-primary overflow-hidden py-3 ticker-hover brutalist-shadow z-40 relative"
    >
      <div className="whitespace-nowrap flex animate-marquee">
        {repeated.map((text, i) => (
          <span
            key={i}
            className="text-label-bold uppercase mx-4 inline-block text-primary-container"
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}
