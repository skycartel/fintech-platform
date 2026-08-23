import { UserPlus, Wallet, Rocket } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    title: 'Create your account',
    desc: 'Complete a streamlined registration and verify your identity in minutes — no paperwork mailed anywhere.',
  },
  {
    icon: Wallet,
    title: 'Fund securely',
    desc: 'Choose from bank transfer, card, or crypto. Deposits are instant and withdrawals processed within hours.',
  },
  {
    icon: Rocket,
    title: 'Start trading',
    desc: 'Access all 500+ instruments with pro tools, live signals, and a free demo to practice your strategy first.',
  },
];

export default function Steps() {
  return (
    <section className="relative py-28">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="reveal text-xs font-semibold text-emerald-400 tracking-[0.3em] uppercase mb-3">
            Get started
          </p>
          <h2 className="reveal reveal-delay-1 font-display font-bold text-4xl sm:text-5xl text-white tracking-tight">
            Live in three simple steps
          </h2>
        </div>

        <div className="relative grid md:grid-cols-3 gap-8">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-px bg-gradient-to-r from-emerald-400/0 via-emerald-400/40 to-emerald-400/0" />

          {steps.map((s, i) => (
            <div key={s.title} className={`reveal reveal-delay-${i + 1} relative`}>
              <div className="flex flex-col items-center text-center">
                <div className="relative w-20 h-20 rounded-2xl glass border border-emerald-500/30 flex items-center justify-center mb-6 glow-emerald">
                  <s.icon className="text-emerald-400" size={28} />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-emerald-400 text-[#04070f] font-display font-bold text-sm flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-xl text-white mb-2.5">{s.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xs">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
