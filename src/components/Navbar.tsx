import { useEffect, useState } from 'react';
import { Menu, X, Smartphone } from 'lucide-react';
import { useUI } from '@/context/UIContext';

const links = [
  { label: 'Markets', href: '#markets' },
  { label: 'Crypto', href: '#crypto' },
  { label: 'Platform', href: '#platform' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'About', href: '#about' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { openPhone } = useUI();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#04070f]/80 backdrop-blur-xl border-b border-emerald-500/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
            <span className="font-display font-bold text-[#04070f] text-lg">M</span>
          </div>
          <span className="font-display font-semibold text-lg text-white tracking-tight">
            Meridian<span className="text-emerald-400">Capital</span>
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm text-slate-300 hover:text-emerald-400 transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-emerald-400 hover:after:w-full after:transition-all after:duration-300"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={openPhone}
            className="text-sm text-slate-300 hover:text-emerald-400 transition-colors px-4 py-2 flex items-center gap-1.5"
          >
            <Smartphone size={15} />
            Mobile App
          </button>
          <a
            href="#login"
            className="text-sm text-slate-300 hover:text-white transition-colors px-4 py-2"
          >
            Sign in
          </a>
          <a
            href="#signup"
            className="btn-shimmer text-sm font-medium text-[#04070f] bg-gradient-to-r from-emerald-400 to-emerald-500 px-5 py-2.5 rounded-lg hover:shadow-lg hover:shadow-emerald-500/40 transition-all"
          >
            Open Account
          </a>
          <a
            href="#admin"
            className="text-sm text-slate-500 hover:text-emerald-400 transition-colors px-2 py-2"
          >
            Admin
          </a>
        </div>

        <button
          className="md:hidden text-slate-200"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-400 ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="px-6 pt-4 pb-6 space-y-3 bg-[#070b18]/95 backdrop-blur-xl">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-slate-300 hover:text-emerald-400"
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <button
              onClick={() => {
                setOpen(false);
                openPhone();
              }}
              className="flex items-center gap-2 py-2 text-slate-300 hover:text-emerald-400 w-full"
            >
              <Smartphone size={15} /> Mobile App
            </button>
          </li>
          <li>
            <a
              href="#signup"
              onClick={() => setOpen(false)}
              className="block text-center text-sm font-medium text-[#04070f] bg-emerald-400 px-5 py-2.5 rounded-lg"
            >
              Open Account
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
