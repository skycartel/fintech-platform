import { ArrowRight } from 'lucide-react';

export default function CTA() {
  return (
    <section id="signup" className="relative py-28">
      <div className="max-w-5xl mx-auto px-6">
        <div className="reveal relative glass rounded-3xl p-12 sm:p-16 text-center overflow-hidden">
          <div
            className="aurora w-[500px] h-[500px] -top-40 -right-40"
            style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)', opacity: 0.3 }}
          />
          <div
            className="aurora w-[500px] h-[500px] -bottom-40 -left-40"
            style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)', opacity: 0.25 }}
          />
          <div className="relative">
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-white tracking-tight mb-5">
              Ready to take your
              <br />
              <span className="gradient-text">first position?</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto mb-9">
              Open a free demo in under two minutes. No credit card, no commitment — just the tools
              and markets you need to start.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#"
                className="btn-shimmer group inline-flex items-center gap-2 text-sm font-semibold text-[#04070f] bg-gradient-to-r from-emerald-400 to-emerald-500 px-8 py-4 rounded-xl hover:shadow-xl hover:shadow-emerald-500/40 transition-all"
              >
                Open Free Account
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white border border-slate-700 px-8 py-4 rounded-xl hover:border-emerald-400/50 hover:bg-white/5 transition-all"
              >
                Try Demo First
              </a>
            </div>
            <p className="mt-7 text-xs text-slate-600">
              No credit card required · Quick setup · 24/7 support
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
