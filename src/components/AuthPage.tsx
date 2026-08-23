import { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { ArrowRight, ArrowLeft, Lock, Mail, User, Loader2, Eye, EyeOff, MailCheck } from 'lucide-react';

type Mode = 'signin' | 'signup' | 'reset';

export default function AuthPage({ adminMode = false }: { adminMode?: boolean }) {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
    if (mode === 'signin') {
      const { error } = await signIn(email, password);
      if (error) setError(error);
    } else if (mode === 'signup') {
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, fullName);
      if (error) setError(error);
      else setSuccess('Account created! You are now signed in.');
    } else if (mode === 'reset') {
      const { error } = await resetPassword(email);
      if (error) setError(error);
      else setSuccess('Password reset instructions have been sent to your email.');
    }
    setLoading(false);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="min-h-screen bg-[#04070f] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div
        className="aurora w-[600px] h-[600px] -top-40 -right-40"
        style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)' }}
      />
      <div
        className="aurora w-[500px] h-[500px] -bottom-40 -left-40"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }}
      />

      <div className="relative z-10 w-full max-w-md">
        <a href="/" className="flex items-center gap-2.5 mb-8 justify-center group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform">
            <span className="font-display font-bold text-[#04070f] text-xl">M</span>
          </div>
          <span className="font-display font-semibold text-xl text-white tracking-tight">
            Meridian<span className="text-emerald-400">Capital</span>
          </span>
        </a>

        <div className="glass rounded-2xl p-8 border border-slate-800/60">
          <h1 className="font-display font-bold text-2xl text-white mb-1">
            {adminMode ? 'Admin Sign In' : mode === 'signin' ? 'Welcome back' : mode === 'signup' ? 'Create your account' : 'Reset password'}
          </h1>
          <p className="text-sm text-slate-400 mb-6">
            {adminMode
              ? 'Sign in with your administrator account to access the control panel.'
              : mode === 'signin'
              ? 'Sign in to access your dashboard.'
              : mode === 'signup'
              ? 'Start trading in under two minutes.'
              : 'Enter your email and we will send you reset instructions.'}
          </p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-sm text-rose-300">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-sm text-emerald-300 flex items-center gap-2">
              <MailCheck size={16} /> {success}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Full name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Morgan"
                    className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/30 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/30 transition-colors"
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <label className="text-xs text-slate-400 mb-1.5 block">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={showPwd ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#0b1124] border border-slate-700/60 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder-slate-600 focus:border-emerald-400/50 focus:outline-none focus:ring-1 focus:ring-emerald-400/30 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-shimmer w-full flex items-center justify-center gap-2 text-sm font-semibold text-[#04070f] bg-gradient-to-r from-emerald-400 to-emerald-500 px-6 py-3.5 rounded-xl hover:shadow-lg hover:shadow-emerald-500/40 transition-all disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {mode === 'signin' && (
            <div className="mt-4 text-right">
              <button
                onClick={() => switchMode('reset')}
                className="text-xs text-slate-500 hover:text-emerald-400 transition-colors"
              >
                Forgot password?
              </button>
            </div>
          )}

          <div className="mt-6 text-center text-sm text-slate-500">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>

        <a
          href={adminMode ? '#' : '/'}
          onClick={(e) => { if (adminMode) { e.preventDefault(); window.location.hash = ''; } }}
          className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-600 hover:text-slate-400 transition-colors"
        >
          <ArrowLeft size={13} /> {adminMode ? 'Back to homepage' : 'Back to homepage'}
        </a>
      </div>
    </div>
  );
}
