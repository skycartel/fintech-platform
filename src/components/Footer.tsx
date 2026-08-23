const cols = [
  {
    title: 'Platform',
    links: ['Web Terminal', 'Mobile App', 'Desktop', 'API Docs', 'System Status'],
  },
  {
    title: 'Markets',
    links: ['Forex', 'Commodities', 'Indices', 'Cryptocurrencies', 'Equities'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Press', 'Partnerships', 'Contact'],
  },
  {
    title: 'Legal',
    links: ['Terms', 'Privacy', 'Risk Disclosure', 'Cookie Policy', 'Regulation'],
  },
];

export default function Footer() {
  return (
    <footer id="about" className="relative border-t border-slate-800/60 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#" className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <span className="font-display font-bold text-[#04070f] text-lg">M</span>
              </div>
              <span className="font-display font-semibold text-lg text-white tracking-tight">
                Meridian<span className="text-emerald-400">Capital</span>
              </span>
            </a>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
              Meridian Capital is a professional trading platform providing access to global forex,
              CFD, and digital-asset markets. Trade with confidence using institutional-grade tools
              and expert support.
            </p>
            <div className="flex gap-3">
              {['X', 'in', 'f', 'yt'].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="w-9 h-9 rounded-lg glass flex items-center justify-center text-xs font-semibold text-slate-400 hover:text-emerald-400 hover:border-emerald-400/40 transition-colors"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map((c) => (
            <div key={c.title}>
              <h4 className="font-display font-semibold text-sm text-white mb-4">{c.title}</h4>
              <ul className="space-y-2.5">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-slate-500 hover:text-emerald-400 transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="border-t border-slate-800/60 pt-8 mb-8">
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-500">Risk Warning:</strong> Trading CFDs and forex carries
            a high level of risk and may result in the loss of all your invested capital. Past
            performance is not indicative of future results. These products are not suitable for
            every investor — please ensure you fully understand the risks involved and seek
            independent advice if necessary. Meridian Capital is a fictional brand created for
            demonstration purposes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/60 pt-8">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} Meridian Capital. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-600">Regulated · Segregated funds · Tier-1 banks</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
