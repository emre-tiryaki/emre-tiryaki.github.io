import { useState } from 'react';
import { useTranslation } from '../../hooks/translation';
import { useAuth } from '../../hooks/auth';

export default function AdminLogin() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const a = t('blog.admin');

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email, password);
    } catch {
      setError(a.loginError);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: '24rem', margin: '0 auto' }}>
      <div className="glass-card rounded-2xl p-6 space-y-4">
        <h2 className="text-xl font-bold text-slate-100">{a.loginTitle}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder={a.email} required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-neutral-100 outline-none focus:border-orange-500/50"
          />
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder={a.password} required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-neutral-100 outline-none focus:border-orange-500/50"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button
            type="submit" disabled={busy}
            className="w-full px-5 py-2.5 rounded-lg text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#f97316,#f59e0b)', opacity: busy ? 0.6 : 1 }}
          >
            {a.loginBtn}
          </button>
        </form>
      </div>
    </div>
  );
}
