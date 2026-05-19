import Link from 'next/link';

const POSTS = [
  {
    id: 'terpeni',
    category: 'Guida',
    date: '12 Ottobre',
    title: "Terpeni: Il Segreto dell'Aroma",
    excerpt: "Scopri come i profili terpenici influenzano non solo l'odore e il sapore, ma anche l'effetto complessivo delle diverse genetiche di canapa light.",
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSTy4Zx4C0MSJJd13Kn6WJ5YifJ0a1U63hQ1x0vIU886Er7nJMndiGt1nA7W6VGDAYP-_nhZFMMO05_HDwc8uJbcGgumYKC5FIdU32YHimX_M9-X-REn_xo3uzksGZPjuOln_QjEWTvkBOdrUu8ZpeP5fAZpqY0eHofmjlnKeM9BGeEet755bnLSzylHNnZJxvnvYIlUFH6wFkGbut9sumx6oJl08f9shIAl3BUQ0BT8nCnD7HEEmqP_LiI6YKLgHrb6Ak64Zmt9k',
    bg: 'var(--color-surface-variant)',
  },
  {
    id: 'cbd-skincare',
    category: 'Lifestyle',
    date: '05 Ottobre',
    title: 'CBD e Skincare Routine',
    excerpt: 'Come integrare creme e unguenti al CBD nella tua routine di bellezza quotidiana per sfruttare le sue proprietà antiossidanti naturali.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAySqKQXtTBuNbv01yExHiSywuZSwxl4h8d4EdCq1JPgKH7FH_WRMa6D75hmw6vbOT_WNbQPL_LsCDOCrkEn7DrAyiCTVbST7FPj6cHVxKyPEQIuKaR_2X7VVjGAlnEd43KGarcV7mNukqDIpnOFhGgRkiaSieGP6wm7pCdnPM8Sj9lhqxaCqdp-lkhlWfJc0HuWhc2oLmBoJ3_ysySOCFN7_Y1CydjgU8Q2l58f5lrVLGdgFD3NlNJcgHkOzg0kYeOdQfhs2OKhjE',
    bg: 'var(--color-surface-dim)',
  },
];

export default function JournalSection() {
  return (
    <section
      className="px-8 py-32 border-b-2 border-(--color-primary)"
      style={{ backgroundColor: 'var(--color-background)' }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-12 border-b-4 pb-4" style={{ borderColor: 'var(--color-primary)' }}>
          <h2 className="text-headline-lg uppercase" style={{ color: 'var(--color-primary)' }}>
            Il Nostro Journal
          </h2>
          <Link
            href="/blog"
            className="text-label-bold uppercase flex items-center gap-2 transition-colors brutalist-border px-4 py-2 hover:opacity-70"
            style={{ color: 'var(--color-neo-orange)' }}
          >
            Leggi Tutto{' '}
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_forward</span>
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {POSTS.map((post) => (
            <article
              key={post.id}
              className="brutalist-border brutalist-shadow hover-lift cursor-pointer group"
              style={{ backgroundColor: post.bg }}
            >
              {/* Image */}
              <div className="h-64 border-b-2 overflow-hidden relative" style={{ borderColor: 'var(--color-primary)' }}>
                <div
                  className="absolute inset-0 group-hover:opacity-0 transition-opacity duration-300 z-10"
                  style={{ backgroundColor: 'rgba(0,66,37,0.2)' }}
                  aria-hidden
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-8">
                <span className="text-label-bold uppercase mb-4 block" style={{ color: 'var(--color-neo-orange)' }}>
                  {post.category} / {post.date}
                </span>
                <h3
                  className="uppercase mb-4 leading-tight"
                  style={{
                    fontFamily: 'var(--font-anybody)',
                    fontSize: '32px',
                    fontWeight: 800,
                    color: 'var(--color-primary)',
                  }}
                >
                  {post.title}
                </h3>
                <p className="text-body-md" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {post.excerpt}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
