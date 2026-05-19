'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface NavChild { label: string; href: string; }
interface NavItem { label: string; href: string; children?: NavChild[]; }

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Canapa Light', href: '/canapa-light',
    children: [
      { label: 'Indoor', href: '/canapa-light/indoor' },
      { label: 'Green House', href: '/canapa-light/green-house' },
      { label: 'Outdoor', href: '/canapa-light/outdoor' },
      { label: 'Primizie', href: '/canapa-light/primizie' },
    ],
  },
  {
    label: 'CBD', href: '/cbd',
    children: [
      { label: 'Olio di CBD', href: '/cbd/olio' },
      { label: 'Cristalli', href: '/cbd/cristalli' },
      { label: 'Caramelle', href: '/cbd/caramelle' },
    ],
  },
  {
    label: 'Cosmesi', href: '/cosmesi',
    children: [
      { label: 'Saponi', href: '/cosmesi/saponi' },
      { label: 'Cura della persona', href: '/cosmesi/cura-della-persona' },
    ],
  },
  {
    label: 'Abbigliamento', href: '/abbigliamento',
    children: [
      { label: 'Marsupi e Borselli', href: '/abbigliamento/marsupi-borselli' },
      { label: 'Zaini e Tracolle', href: '/abbigliamento/zaini-tracolle' },
      { label: 'Portafogli', href: '/abbigliamento/portafogli' },
      { label: 'Porta Tabacco', href: '/abbigliamento/porta-tabacco' },
      { label: 'Cappelli', href: '/abbigliamento/cappelli' },
      { label: 'Calzini', href: '/abbigliamento/calzini' },
    ],
  },
  {
    label: 'Accessori', href: '/accessori',
    children: [
      { label: 'Vaporizzatori', href: '/accessori/vaporizzatori' },
      { label: 'Grinder', href: '/accessori/grinder' },
      { label: 'Pipe e Bong', href: '/accessori/pipe-bong' },
      { label: 'Gadget e Varie', href: '/accessori/gadget-varie' },
    ],
  },
  { label: 'Offerte', href: '/offerte' },
  { label: 'Blog', href: '/blog' },
];

function NavLink({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href + '/'));

  const enter = () => { if (timer.current) clearTimeout(timer.current); setOpen(true); };
  const leave = () => { timer.current = setTimeout(() => setOpen(false), 140); };

  return (
    <div className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <Link
        href={item.href}
        className="flex items-center gap-1 text-label-bold uppercase pb-1 whitespace-nowrap transition-colors hover:text-[var(--color-primary)]"
        style={{
          color: isActive ? 'var(--color-primary)' : 'var(--color-on-tertiary-fixed)',
          borderBottom: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
          fontSize: '12.5px',
          letterSpacing: '0.05em',
        }}
      >
        {item.label}
        {item.children && (
          <svg viewBox="0 0 10 6" className="w-2 h-2 transition-transform" style={{ transform: open ? 'rotate(180deg)' : '' }} fill="currentColor">
            <path d="M0 0l5 6 5-6z" />
          </svg>
        )}
      </Link>

      {item.children && open && (
        <div
          className="absolute top-full left-0 mt-2 min-w-[210px] z-50 brutalist-border"
          style={{ backgroundColor: 'var(--color-tertiary-fixed)', boxShadow: '4px 4px 0px 0px var(--color-primary)', animation: 'dd-in 0.13s ease forwards' }}
        >
          {item.children.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="block px-5 py-3 text-label-bold uppercase transition-colors border-b border-(--color-outline-variant) last:border-0"
              style={{ color: 'var(--color-on-tertiary-fixed)', fontSize: '12px' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-acid-lime)'; (e.currentTarget as HTMLElement).style.color = 'var(--color-primary)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = ''; (e.currentTarget as HTMLElement).style.color = 'var(--color-on-tertiary-fixed)'; }}
            >
              {c.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [mobile, setMobile] = useState(false);

  return (
    <>
      <style>{`@keyframes dd-in{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <nav className="sticky top-0 z-50 w-full border-b-2 border-(--color-primary)" style={{ backgroundColor: 'var(--color-tertiary-fixed)', boxShadow: '0 4px 0 0 rgba(0,66,37,0.15)', fontFamily: 'var(--font-anybody)' }}>
        <div className="flex justify-between items-center px-6 py-3">
          <Link href="/" className="flex items-center gap-3 tracking-tighter flex-shrink-0 font-black" style={{ fontSize: 'clamp(18px,2.2vw,28px)' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/LogoCanapaStore.webp"
              alt="Logo CANAPASTORE.IT"
              className="w-auto object-contain"
              style={{ height: '1.1em' }}
            />
            <span className="uppercase select-none">
              <span style={{ color: 'var(--color-primary)' }}>CANAPA</span>
              <span style={{ color: 'var(--color-neo-orange)' }}>STORE.IT</span>
            </span>
          </Link>

          <div className="hidden lg:flex gap-4 items-center flex-1 justify-center flex-wrap px-4">
            {NAV_ITEMS.map((item) => <NavLink key={item.href} item={item} pathname={pathname} />)}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button className="brutalist-border brutalist-shadow active-press px-4 py-2 text-label-bold uppercase hidden sm:block" style={{ backgroundColor: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)', fontSize: '12px' }}>
              Acquista Ora
            </button>
            <button className="cursor-pointer" style={{ color: 'var(--color-primary)' }} aria-label="Cerca">
              <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>search</span>
            </button>
            <button className="lg:hidden cursor-pointer" style={{ color: 'var(--color-primary)' }} onClick={() => setMobile((v) => !v)} aria-label="Menu">
              <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>{mobile ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {mobile && (
          <div className="lg:hidden border-t-2 border-(--color-primary)" style={{ backgroundColor: 'var(--color-tertiary-fixed)' }}>
            {NAV_ITEMS.map((item) => (
              <div key={item.href}>
                <Link href={item.href} className="block px-6 py-4 text-label-bold uppercase border-b border-(--color-outline-variant)" style={{ color: pathname === item.href ? 'var(--color-primary)' : 'var(--color-on-tertiary-fixed)', fontSize: '13px' }} onClick={() => setMobile(false)}>
                  {item.label}
                </Link>
                {item.children?.map((c) => (
                  <Link key={c.href} href={c.href} className="block pl-10 pr-6 py-3 border-b border-(--color-outline-variant)" style={{ color: 'var(--color-on-surface-variant)', fontSize: '12px' }} onClick={() => setMobile(false)}>
                    — {c.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}
      </nav>
    </>
  );
}
