import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote:
      'The execution speed is genuinely unmatched. I run an algo strategy and fills are consistently sub-15ms. The API documentation is the best I have seen from any broker.',
    name: 'Daniel R.',
    role: 'Algorithmic Trader · London',
  },
  {
    quote:
      'I started as a complete beginner. The educational resources and demo account let me build confidence before risking capital. Support actually answers within minutes.',
    name: 'Aisha M.',
    role: 'Retail Trader · Dubai',
  },
  {
    quote:
      'Ten years trading and this is the cleanest platform I have used. Spreads are what they advertise, withdrawals hit my account same day. No surprises, ever.',
    name: 'Marcus T.',
    role: 'Professional Trader · Singapore',
  },
];

export default function Testimonials() {
  return (
    <section id="insights" className="relative py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="reveal text-xs font-semibold text-emerald-400 tracking-[0.3em] uppercase mb-3">
            Trader voices
          </p>
          <h2 className="reveal reveal-delay-1 font-display font-bold text-4xl sm:text-5xl text-white tracking-tight">
            Trusted by traders worldwide
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={t.name} className={`reveal reveal-delay-${i + 1} glass card-lift rounded-2xl p-8`}>
              <Quote className="text-emerald-400/40 mb-5" size={32} />
              <p className="text-slate-300 leading-relaxed text-sm mb-7">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center font-display font-bold text-[#04070f]">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-display font-semibold text-white text-sm">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
