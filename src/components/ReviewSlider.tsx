'use client';

import { useState, useEffect, useCallback } from 'react';

// 46 completely unique, real reviews paired into 23 slides (2 reviews per slide)
const REVIEW_PAIRS = [
  [
    { initials: 'C.B.', author: 'Claudia Bigiani', rating: 5, product: 'Kleaner ANTI-TEST salivare', text: 'Il Kleaner ha un sapore amaro ma almeno funziona. Servizio clienti super disponibile per dubbi o domande, ho trovato anche un omaggio che è stata una piacevole sorpresa e mi sono iscritta al sito per poter avere sconti aggiuntivi per i primi ordini grazie' },
    { initials: 'G.T.', author: 'Giulio Tremonti', rating: 5, product: 'Panama - Premium Quality', text: 'La Panama è sicuramente una delle CBD top' },
  ],
  [
    { initials: 'M.', author: 'Mario', rating: 4, product: 'Gorilla Glue - Premium Quality', text: 'Molto buona al gusto, proprietà organolettiche discrete.' },
    { initials: 'V.', author: 'Vicrotinox', rating: 5, product: null, text: 'Spedizione anonima e discreta. Azienda con grande qualità.' },
  ],
  [
    { initials: 'C.C.', author: 'Carlo C.', rating: 5, product: 'XVape Avant - Mini Vaporizzatore Portatile Nero', text: 'XVape Avant è un vaporizzatore piccolo e discreto ma molto potente. Rapporto qualità-prezzo più che giusto. Anche la canapa tutta molto molto buona, complimenti.' },
    { initials: 'D.', author: 'Dalila', rating: 5, product: 'OLIO CBD 10% su 10 ml', text: 'Olio di CBD 10% rilassante, lo utilizzo quotidianamente e mi aiuta a rilassarmi. Servizio clienti sempre disponibili e personale competente in materia. Azienda affidabile.' },
  ],
  [
    { initials: 'M.', author: 'Mattia', rating: 5, product: 'Gelato 41 - Premium Quality', text: 'Di sicuro tra le più buone genetiche' },
    { initials: 'C.', author: 'Claudio', rating: 5, product: 'XMAX Starry V4 - vaporizzatore portatile - 2 anni di garanzia - kit completo - EverGreen', text: "XMAX Starry V4 Vaporizzatore portatile che consiglio: 1) la valvola dell'aria permette di fumare sia con boccata più chiusa che con un tiro più arioso. 2)E' un prodotto con ottimi componenti, lo utilizzo quotidianamente e non mi ha dato problemi 3)Si carica con un cavetto in dotazione uguale a quello per caricare il cellulare 4)A differenza di quello che avevo prima questo è molto facile da usare (basta accenderlo e si attiva da solo, idem per spegnerlo 5)la fumata da molta soddisfazione, nonostante sia piccolo e comodo da portare in giro fa una ottima fumata" },
  ],
  [
    { initials: 'M.', author: 'Marta', rating: 5, product: 'Caramelle CBD Cannabis Bakehouse', text: 'Ottimi prodotti al CBD :)' },
    { initials: 'A.', author: 'Alessandro', rating: 5, product: 'OLIO CBD 10% su 10 ml', text: 'Olio come da descrizione fa il suo dovere.' },
  ],
  [
    { initials: 'M.', author: 'Mary', rating: 5, product: 'Kleaner ANTI-TEST salivare', text: 'Kleaner testato il giorno dopo e funziona dopo 15 minuti dall\'utilizzo. Va applicato correttamente cioè 5 spruzzate almeno. Azienda affidabile anche se ho avuto dei ritardi nella spedizione sotto le festività.' },
    { initials: 'R.S.', author: 'R. S.', rating: 5, product: 'Kleaner ANTI-TEST salivare', text: 'Prodotto valido su test salivare. Servizio clienti molto gentile e disponibile' },
  ],
  [
    { initials: 'C.G.', author: 'Carlo Gaudone', rating: 5, product: 'Trinciato', text: 'Trinciato di qualità altissima ad un prezzo molto conveniente. Ho apprezzato gli omaggi a sorpresa!' },
    { initials: 'C.', author: 'CBWEB', rating: 5, product: 'Sour Diesel - Limited Edition', text: 'E\' la prima volta che ho acquistato e il prodotto si è rivelato essere di valore.' },
  ],
  [
    { initials: 'F.', author: 'Frenci', rating: 5, product: 'XMAX Starry V4 - vaporizzatore portatile - 2 anni di garanzia - kit completo - EverGreen', text: 'Cercavo un vaporizzatore per erba e ho chiamato il numero assistenza clienti, mi hanno spiegato le differenze e mi hanno saputo consigliare quello adatto a me. Dopo 3 settimane di utilizzo quotidiano posso dire che è un ottimo prodotto.' },
    { initials: 'F.C.', author: 'Franco C.', rating: 5, product: 'Buddha Cheese - Premium Quality', text: 'Sito affidabile con tante varietà molto particolari. Buddha Cheese must have.' },
  ],
  [
    { initials: 'M.', author: 'Missgatto', rating: 5, product: null, text: 'Azienda affidabile, prodotti TOP, continuate così' },
    { initials: 'M.G.', author: 'Maria Giulia', rating: 5, product: 'Trinciato', text: 'Rapporto qualità-prezzo fantastico :)' },
  ],
  [
    { initials: 'A.', author: 'Amanda', rating: 5, product: null, text: 'Sono anni che acquisto in questo sito: grande professionalità e omaggi a sorpresa.' },
    { initials: 'J.', author: 'Jak', rating: 4, product: 'Antinfiammatorio - BURRO "TUTTO PASSA" - Verdesativa', text: 'Spedizione veloce, ottimi saponi artigianali' },
  ],
  [
    { initials: 'K.', author: 'Karl', rating: 5, product: 'Hindu Kush - Limited Edition', text: 'L\'ultima Hindu Kush è spaziale' },
    { initials: 'L.L.', author: 'Ludovico Logiusto', rating: 5, product: '00 Hash - Premium Quality', text: 'Battitura di polline molto buona' },
  ],
  [
    { initials: 'M.', author: 'Marco', rating: 5, product: null, text: 'Azienda seria, prodotti biologici di grande qualità, riprenderò sicuramente.' },
    { initials: 'G.', author: 'Giulia', rating: 5, product: 'OLIO CBD 10% su 10 ml', text: 'Olio di CBD utilissimo' },
  ],
  [
    { initials: 'C.', author: 'Carlo', rating: 5, product: null, text: 'Acquisto mensilmente, prodotti di grande qualità e spedizione veloce.' },
    { initials: 'A.', author: 'Alessandro', rating: 5, product: null, text: 'ALTISSIMO LIVELLO! Ho acquistato in altri siti ma questo è decisamente il migliore, vale la pensa spendere qualche euro in più. Azienda professionale' },
  ],
  [
    { initials: 'L.', author: 'Laura', rating: 5, product: 'Charas - Premium Quality', text: 'Charas voto massimo. Finalmente un prodotto che ha grandi qualità anche come estratti per dormire.' },
    { initials: 'M.', author: 'Michele', rating: 4, product: null, text: 'Spedizione discreta, prodotti molto buoni.' },
  ],
  [
    { initials: 'A.I.', author: 'Anna I.', rating: 4, product: null, text: 'Spedizione veloce 24h lavorative con tracking del pacco' },
    { initials: 'A.', author: 'Antonio', rating: 5, product: 'New York Diesel - Premium Quality', text: 'Miglio rapporto qualità prezzo' },
  ],
  [
    { initials: 'C.', author: 'Christian', rating: 4, product: null, text: 'Spedizione veloce e prodotti italiani' },
    { initials: 'M.', author: 'MilanAC', rating: 5, product: null, text: 'Spedizione veloce, arrivato tutto il giorno dopo e in completo anonimato.' },
  ],
  [
    { initials: 'N.I.', author: 'Nessuno indicato', rating: 5, product: 'Santa Maria - Premium Quality Outdoor', text: 'Canapa Light di qualità e biologica. Santa Maria è tra le migliori di fascia economica.' },
    { initials: 'C.', author: 'Carla', rating: 3, product: 'Antinfiammatorio - BURRO "TUTTO PASSA" - Verdesativa', text: 'Buon prodotto anche se prezzo medio' },
  ],
  [
    { initials: 'S.', author: 'Sara', rating: 5, product: null, text: 'Mi faccio spedire tutto a lavoro e arriva sempre il giorno lavorativo successivo in completo anonimato. Mail con tracciamento del pacco e servizio clienti sempre molto disponibile.' },
    { initials: 'L.T.', author: 'LORELLA T.', rating: 5, product: 'OLIO CBD 10% su 10 ml', text: 'l\'olio provatro funziona!!! ne ho cercati biologici e naturali come mi piace a me e anche provati altri diversi ma qsto è il migliore! bravi continuate così lo consiglio......... LORELLA' },
  ],
  [
    { initials: 'M.C.', author: 'Mdb. C.', rating: 5, product: 'Charas - Premium Quality', text: 'Ho provato tutti gli Hashish di questo sito e sono tutti molto buoni ma alla fine il Charas è sicuramente da provare per chi come me ama gli estratti. Difficile trovare di meglio perchè al CBD si trovano molti hashish che sono belli a vedersi ma come risultato sono di pessima qualità.' },
    { initials: 'A.', author: 'Alice', rating: 5, product: null, text: 'Cannabis di altissima qualità. Staff sempre disponibile' },
  ],
  [
    { initials: 'M.', author: 'Mac', rating: 5, product: '20% CBD su 10ml - Olio di CBD in Olio d\'Oliva', text: 'Olio di CBD concilia bene il riposo dopo una settimana di utilizzo.' },
    { initials: 'M.', author: 'Maddalena', rating: 4, product: null, text: 'Servizio clienti sempre disponibile per chiarimenti o domande.' },
  ],
  [
    { initials: 'V.V.', author: 'Valerio V.', rating: 5, product: 'Lebanon Hash - Premium Quality', text: 'Kleaner unico spray anti Thc che vale la pena acquistare. Lebanon Hash è stata una scoperta dato che non avevo mai provato il fumo al cbd e devo fare i complimenti per il prodotto' },
    { initials: 'G.', author: 'Giulia', rating: 5, product: 'Purple Haze - Limited Edition', text: 'Purple Haze di qualità eccellente' },
  ],
  [
    { initials: 'A.', author: 'Anna', rating: 5, product: null, text: 'Amnesia di Canapastore è la migliore che abbia provato. La consiglio.' },
    { initials: 'G.', author: 'Giancarlo', rating: 5, product: 'Amnesia - Premium Quality', text: 'Amnesia: Aroma 9 Fumata 10 Grandezza cime 8 E\' pieno di siti vendono canapa outdoor spacciandola per indoor. consiglio di acquistare perchè qui è un prodotto indubbiamente INDOOR e di qualità' },
  ],
  [
    { initials: 'W.', author: 'Weeder', rating: 5, product: 'Sour Diesel - Limited Edition', text: 'Spedizione anonima e veloce. Prodotti INDOOR S P E T T A C O L O !' },
    { initials: 'C.B.', author: 'Camillo Boncompagni', rating: 4, product: null, text: 'Spedizione discreta e ottimi prodotti come avevo richiesto.' },
  ],
] as const;

const TOTAL_SLIDES = REVIEW_PAIRS.length; // 23

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" fill={i < count ? "var(--color-neo-orange)" : "rgba(0,0,0,0.15)"} width="20" height="20" aria-hidden>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function Avatar({ initials }: { initials: string }) {
  return (
    <div
      className="w-10 h-10 rounded-full brutalist-border flex items-center justify-center flex-shrink-0 font-black"
      style={{ backgroundColor: 'var(--color-acid-lime)', color: 'var(--color-primary)', fontSize: '11px', fontFamily: 'var(--font-anybody)' }}
    >
      {initials}
    </div>
  );
}

type Review = { initials: string; author: string; rating: number; product: string | null; text: string };

function ReviewCard({ review, variant, className }: { review: Review; variant: 'white' | 'lime'; className?: string }) {
  const bg = variant === 'white' ? 'var(--color-surface-container-lowest)' : 'var(--color-acid-lime)';
  return (
    <div
      className={`brutalist-border flex flex-col justify-between w-full h-[340px] md:h-[300px] review-card-item ${className || ''}`}
      style={{
        backgroundColor: bg,
        padding: '1.5rem',
        boxShadow: '6px 6px 0px 0px var(--color-primary)',
      }}
    >
      <div className="flex-1 flex flex-col min-h-0">
        <Stars count={review.rating} />
        <div className="flex-1 overflow-y-auto brutalist-scrollbar pr-1 mb-2">
          <p className="text-body-md" style={{ fontWeight: 500, fontStyle: 'italic', color: 'var(--color-primary)', lineHeight: '1.45' }}>
            &ldquo;{review.text}&rdquo;
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 border-t-2 pt-3 flex-shrink-0" style={{ borderColor: 'var(--color-primary)' }}>
        <Avatar initials={review.initials} />
        <div className="min-w-0">
          <p className="truncate" style={{ fontFamily: 'var(--font-anybody)', fontWeight: 800, fontSize: '12px', color: 'var(--color-primary)', textTransform: 'uppercase' }}>{review.author}</p>
          <p style={{ fontSize: '11px', fontWeight: 600, fontFamily: 'var(--font-anybody)', color: 'var(--color-on-primary-fixed-variant)', lineHeight: '1.1' }}>Acquisto verificato</p>
          {review.product && <p className="truncate" style={{ fontSize: '10px', fontFamily: 'var(--font-body)', color: 'var(--color-on-surface-variant)', marginTop: '2px', fontWeight: 500 }}>{review.product}</p>}
        </div>
      </div>
    </div>
  );
}

export default function ReviewSlider() {
  const [slide, setSlide] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
  const [stage, setStage] = useState<'resting' | 'exiting' | 'entering'>('resting');
  const [busy, setBusy] = useState(false);

  const DURATION = 380; // Animation duration in ms

  const jumpTo = useCallback((target: number) => {
    if (busy || target === slide) return;
    const dir = target > slide ? 'next' : 'prev';
    setBusy(true);
    setDirection(dir);
    setStage('exiting');

    setTimeout(() => {
      setSlide(target);
      setStage('entering');

      // Force a tiny layout update before removing the transition-override entering stage
      setTimeout(() => {
        setStage('resting');
        setBusy(false);
      }, 40);
    }, DURATION);
  }, [busy, slide]);

  const navigate = useCallback((dir: 'prev' | 'next') => {
    const target = dir === 'next'
      ? (slide + 1) % TOTAL_SLIDES
      : (slide - 1 + TOTAL_SLIDES) % TOTAL_SLIDES;
    jumpTo(target);
  }, [slide, jumpTo]);

  useEffect(() => {
    const t = setInterval(() => navigate('next'), 9000);
    return () => clearInterval(t);
  }, [navigate]);

  const [left, right] = REVIEW_PAIRS[slide];

  return (
    <>
      <style>{`
        /* Continuous Breathing Float Animations on Parent Wrappers (NEVER added/removed, so they never snap) */
        @keyframes parent-float-a { 
          0%, 100% { transform: translateY(0); } 
          50% { transform: translateY(-4px); } 
        }
        @keyframes parent-float-b { 
          0%, 100% { transform: translateY(-2px); } 
          50% { transform: translateY(2px); } 
        }

        .card-wrapper-float-left {
          animation: parent-float-a 4.5s ease-in-out infinite;
        }
        .card-wrapper-float-right {
          animation: parent-float-b 4.5s ease-in-out infinite;
          animation-delay: 1.5s;
        }

        /* Base styles for transitionable cards */
        .review-card-item {
          transition: transform ${DURATION}ms cubic-bezier(0.25, 1, 0.5, 1), opacity ${DURATION}ms cubic-bezier(0.25, 1, 0.5, 1);
          will-change: transform, opacity;
        }

        /* STAGE: RESTING (Active view, resting rotation applied cleanly) */
        .stage-resting .card-left {
          transform: rotate(-2deg);
          opacity: 1;
        }
        .stage-resting .card-right {
          transform: rotate(2deg);
          opacity: 1;
        }

        /* STAGE: EXITING (Cards slide and dissolve away seamlessly) */
        .stage-exiting.dir-next .card-left {
          transform: translateX(-140%) rotate(-12deg) scale(0.85);
          opacity: 0;
        }
        .stage-exiting.dir-next .card-right {
          transform: translateX(-140%) rotate(-8deg) scale(0.85);
          opacity: 0;
          transition-delay: 45ms;
        }
        .stage-exiting.dir-prev .card-left {
          transform: translateX(140%) rotate(8deg) scale(0.85);
          opacity: 0;
          transition-delay: 45ms;
        }
        .stage-exiting.dir-prev .card-right {
          transform: translateX(140%) rotate(12deg) scale(0.85);
          opacity: 0;
        }

        /* STAGE: ENTERING (Cards instantly positioned at starting point, zero transition) */
        .stage-entering .review-card-item {
          transition: none !important;
        }
        .stage-entering.dir-next .card-left {
          transform: translateX(140%) rotate(8deg) scale(0.85);
          opacity: 0;
        }
        .stage-entering.dir-next .card-right {
          transform: translateX(140%) rotate(12deg) scale(0.85);
          opacity: 0;
        }
        .stage-entering.dir-prev .card-left {
          transform: translateX(-140%) rotate(-12deg) scale(0.85);
          opacity: 0;
        }
        .stage-entering.dir-prev .card-right {
          transform: translateX(-140%) rotate(-8deg) scale(0.85);
          opacity: 0;
        }

        /* Custom scrollbar for brutalist text overflow */
        .brutalist-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .brutalist-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .brutalist-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-primary);
          border-radius: 2px;
        }
      `}</style>

      <section className="min-h-[100vh] min-h-[100svh] px-4 md:px-8 py-16 md:py-24 border-y-4 border-(--color-primary) overflow-hidden relative flex flex-col justify-between" style={{ backgroundColor: 'var(--color-deep-green)' }}>
        {/* Animated inverted grid */}
        <div className="absolute inset-0 pointer-events-none opacity-15 grid-bg-animated" style={{ filter: 'invert(1)' }} aria-hidden />

        {/* Heading (Flex Top) */}
        <div className="text-center relative z-10 flex-shrink-0 mb-6">
          <h2 className="uppercase inline-flex items-center gap-4 flex-wrap justify-center" style={{ fontFamily: 'var(--font-anybody)', fontSize: 'clamp(26px,4vw,52px)', fontWeight: 900, color: 'var(--color-surface-container-lowest)', letterSpacing: '-0.02em' }}>
            LA{' '}
            <span className="brutalist-border px-3 py-1" style={{ backgroundColor: 'var(--color-neo-orange)', color: 'var(--color-on-primary)' }}>VOCE</span>
            {' '}DEI CLIENTI
          </h2>
        </div>

        {/* Cards container (Flex Middle - Centered) */}
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between gap-4 md:gap-8 relative z-10 my-auto">
          {/* Previous Arrow Button */}
          <button
            onClick={() => navigate('prev')}
            id="review-prev"
            className="brutalist-border brutalist-shadow active-press flex-shrink-0 p-4 lg:p-5 hidden md:flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-acid-lime)', color: 'var(--color-primary)' }}
            aria-label="Slide precedente"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>arrow_back</span>
          </button>

          {/* Cards Wrapper with state class names */}
          <div className={`flex-1 flex flex-col md:flex-row gap-6 md:gap-8 items-center justify-center w-full stage-${stage} dir-${direction}`}>
            {/* Left Wrapper containing continuous floating animation */}
            <div className="card-wrapper-float-left w-full max-w-[460px]">
              <ReviewCard review={left} variant="white" className="card-left" />
            </div>
            {/* Right Wrapper containing continuous floating animation */}
            <div className="card-wrapper-float-right w-full max-w-[460px]">
              <ReviewCard review={right} variant="lime" className="card-right" />
            </div>
          </div>

          {/* Next Arrow Button */}
          <button
            onClick={() => navigate('next')}
            id="review-next"
            className="brutalist-border brutalist-shadow active-press flex-shrink-0 p-4 lg:p-5 hidden md:flex items-center justify-center"
            style={{ backgroundColor: 'var(--color-acid-lime)', color: 'var(--color-primary)' }}
            aria-label="Slide successiva"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>arrow_forward</span>
          </button>
        </div>

        {/* Mobile controls (Only on smaller viewports) */}
        <div className="flex justify-center gap-6 mt-8 md:hidden relative z-10 flex-shrink-0">
          <button onClick={() => navigate('prev')} className="brutalist-border brutalist-shadow active-press p-3.5" style={{ backgroundColor: 'var(--color-acid-lime)', color: 'var(--color-primary)' }} aria-label="Precedente">
            <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>arrow_back</span>
          </button>
          <button onClick={() => navigate('next')} className="brutalist-border brutalist-shadow active-press p-3.5" style={{ backgroundColor: 'var(--color-acid-lime)', color: 'var(--color-primary)' }} aria-label="Successiva">
            <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>arrow_forward</span>
          </button>
        </div>

        {/* Navigation Indicators / Dots (Flex Bottom) */}
        <div className="flex flex-wrap justify-center gap-2 max-w-xl mx-auto mt-8 relative z-10 flex-shrink-0">
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <button
              key={i}
              onClick={() => jumpTo(i)}
              aria-label={`Slide ${i + 1}`}
              className="hover:bg-[var(--color-acid-lime)] transition-all duration-300"
              style={{
                width: i === slide ? '28px' : '10px',
                height: '10px',
                backgroundColor: i === slide ? 'var(--color-acid-lime)' : 'rgba(255,255,255,0.22)',
                border: '1.5px solid var(--color-primary)',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      </section>
    </>
  );
}
