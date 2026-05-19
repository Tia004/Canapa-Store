'use client';

import { useState, type FormEvent } from 'react';

const CANNABIS_PATH = "M477.16,292.045c0,0-62.848-4.221-125.061,22.069c11.664-13.634,23.084-28.804,33.416-45.603c51.428-83.723,56.047-174.385,56.047-174.385s-78.774,45.1-130.221,128.822c-7.563,12.3-13.99,24.738-19.668,37.029c3.467-20.557,5.744-42.617,5.744-65.72C297.417,86.977,249.892,0,249.892,0s-47.506,86.977-47.506,194.259c0,23.102,2.279,45.163,5.742,65.713c-5.68-12.293-12.123-24.723-19.67-37.023C137.017,139.227,58.238,94.127,58.238,94.127s4.623,90.662,56.05,174.385c10.329,16.799,21.75,31.969,33.416,45.603C85.472,287.824,22.64,292.045,22.64,292.045s37.99,47.329,100.418,73.905c23.818,10.137,47.734,15.764,68.231,18.881c-9.681,0.716-19.997,2.132-30.503,4.71c-45.443,11.111-77.006,38.909-77.006,38.909s42.105,9.768,87.561-1.351c29.467-7.217,52.928-21.347,65.893-30.448l-10.852,86.821c-0.506,4.125,0.635,8.272,3.157,11.404c2.522,3.125,6.147,4.923,9.974,4.923h20.791c3.826,0,7.451-1.798,9.975-4.923c2.522-3.132,3.66-7.279,3.156-11.404l-10.852-86.814c12.967,9.103,36.426,23.225,65.875,30.441c45.457,11.118,87.561,1.351,87.561,1.351s-31.564-27.798-77.002-38.909c-10.512-2.578-20.828-3.994-30.508-4.71c20.504-3.117,44.42-8.744,68.238-18.881C439.173,339.374,477.16,292.045,477.16,292.045z";

/** Seamless tiling cannabis-leaf SVG pattern overlay */
function CannabisPattern({ fillColor = 'currentColor' }: { fillColor?: string }) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden
      style={{ opacity: 0.08 }}
    >
      <defs>
        <pattern id="leaf-tile" x="0" y="0" width="110" height="110" patternUnits="userSpaceOnUse" patternTransform="rotate(25)">
          {/* leaf scaled down ~0.18x */}
          <g transform="translate(5,5) scale(0.18)">
            <path d={CANNABIS_PATH} fill={fillColor} />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#leaf-tile)" />
    </svg>
  );
}

/** Large single-leaf watermark — sits behind form inputs */
function LeafWatermark({ fillColor = '#004225' }: { fillColor?: string }) {
  return (
    <svg
      className="absolute pointer-events-none select-none"
      aria-hidden
      viewBox="0 0 499.8 499.8"
      style={{
        width: '90%',
        maxWidth: '480px',
        height: 'auto',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%) rotate(10deg)',
        opacity: 0.06,
        fill: fillColor,
      }}
    >
      <path d={CANNABIS_PATH} />
    </svg>
  );
}

/** Flat mail icon (no emoji) */
function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="var(--color-neo-orange)" width="52" height="52" aria-hidden>
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

export default function NewsletterContact() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [contactData, setContactData] = useState({ nome: '', cognome: '', email: '', messaggio: '' });
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [contactSent, setContactSent] = useState(false);

  const handleNewsletter = (e: FormEvent) => { e.preventDefault(); setNewsletterSent(true); setNewsletterEmail(''); };
  const handleContact = (e: FormEvent) => { e.preventDefault(); setContactSent(true); setContactData({ nome: '', cognome: '', email: '', messaggio: '' }); };

  return (
    <section id="newsletter-section" className="px-8 py-32 border-b-2 border-(--color-primary)" style={{ backgroundColor: 'var(--color-acid-lime)' }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

        {/* ── Newsletter (left) ── */}
        <div
          className="p-12 brutalist-border brutalist-shadow-lg relative overflow-hidden"
          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-surface)' }}
        >
          {/* Seamless cannabis pattern */}
          <CannabisPattern fillColor="#F0FF42" />

          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-6"><MailIcon /></div>
            <h3 className="text-headline-lg-mobile uppercase mb-4">Unisciti al Culto</h3>
            <p className="text-body-md mb-8" style={{ color: 'var(--color-surface-dim)' }}>
              Iscriviti per sconti brutali, drop esclusivi e notizie fresche dal mondo della botanica italiana.
            </p>

            {newsletterSent ? (
              <div className="border-2 border-current p-4 text-label-bold uppercase" style={{ color: 'var(--color-acid-lime)' }}>
                ISCRIZIONE CONFERMATA! Benvenuto nel culto verde.
              </div>
            ) : (
              <form onSubmit={handleNewsletter} className="flex flex-col gap-4" noValidate>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="LA TUA EMAIL"
                  className="bg-transparent border-2 p-4 text-label-bold uppercase w-full focus:outline-none"
                  style={{ borderColor: 'var(--color-surface)', color: 'var(--color-surface)' }}
                />
                <button
                  type="submit"
                  className="brutalist-border p-4 uppercase active-press"
                  style={{ backgroundColor: 'var(--color-neo-orange)', color: 'var(--color-primary)', fontFamily: 'var(--font-anybody)', fontSize: '22px', fontWeight: 800 }}
                >
                  ISCRIVIMI
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── Contact form (right) ── */}
        <div
          className="p-12 brutalist-border brutalist-shadow-lg relative overflow-hidden"
          style={{ backgroundColor: 'var(--color-surface-container-lowest)' }}
        >
          {/* Single huge leaf watermark behind inputs */}
          <LeafWatermark fillColor="var(--color-primary)" />

          <div className="relative z-10">
            {/* Title */}
            <div className="flex items-center gap-3 mb-8">
              <svg viewBox="0 0 24 24" fill="var(--color-primary)" width="30" height="30" aria-hidden>
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
              <h3 className="text-headline-lg-mobile uppercase" style={{ color: 'var(--color-primary)' }}>
                Parliamo
              </h3>
            </div>

            {contactSent ? (
              <div className="border-2 p-4 text-label-bold uppercase" style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}>
                MESSAGGIO INVIATO! Ti risponderemo presto.
              </div>
            ) : (
              <form onSubmit={handleContact} className="flex flex-col gap-5" noValidate>
                <div className="grid grid-cols-2 gap-4">
                  <input id="contact-nome" type="text" required value={contactData.nome} onChange={(e) => setContactData((d) => ({ ...d, nome: e.target.value }))} placeholder="NOME" className="p-4 text-label-bold uppercase w-full focus:outline-none border-2" style={{ backgroundColor: 'var(--color-surface-variant)', borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }} />
                  <input id="contact-cognome" type="text" required value={contactData.cognome} onChange={(e) => setContactData((d) => ({ ...d, cognome: e.target.value }))} placeholder="COGNOME" className="p-4 text-label-bold uppercase w-full focus:outline-none border-2" style={{ backgroundColor: 'var(--color-surface-variant)', borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }} />
                </div>
                <input id="contact-email" type="email" required value={contactData.email} onChange={(e) => setContactData((d) => ({ ...d, email: e.target.value }))} placeholder="EMAIL" className="p-4 text-label-bold uppercase w-full focus:outline-none border-2" style={{ backgroundColor: 'var(--color-surface-variant)', borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }} />
                <textarea id="contact-messaggio" required rows={4} value={contactData.messaggio} onChange={(e) => setContactData((d) => ({ ...d, messaggio: e.target.value }))} placeholder="DI COSA HAI BISOGNO?" className="p-4 text-label-bold uppercase w-full focus:outline-none border-2 resize-none" style={{ backgroundColor: 'var(--color-surface-variant)', borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }} />
                <button type="submit" className="border-2 p-4 uppercase active-press w-fit" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-surface)', borderColor: 'var(--color-primary)', fontFamily: 'var(--font-anybody)', fontSize: '22px', fontWeight: 800 }}>
                  INVIA MESSAGGIO
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
