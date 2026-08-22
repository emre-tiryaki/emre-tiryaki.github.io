import { useState } from 'react';
import { useTranslation } from '../../hooks/translation';
import { useAuth } from '../../hooks/auth';
import Button from '../ui/Button';
import FormField from '../ui/FormField';

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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        boxSizing: 'border-box',
      }}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '24rem',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <h2 className="text-gradient-orange" style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
            {a.loginTitle}
          </h2>
          <p style={{ fontSize: '0.8rem', color: '#737373', margin: 0 }}>{a.loginSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
          <FormField
            label={a.email}
            name="email"
            type="email"
            value={email}
            onChange={(name, v) => setEmail(v)}
            placeholder={a.emailPlaceholder}
            required
            autoFocus
            autoComplete="email"
          />
          <FormField
            label={a.password}
            name="password"
            type="password"
            value={password}
            onChange={(name, v) => setPassword(v)}
            placeholder={a.passwordPlaceholder}
            required
            autoComplete="new-password"
          />

          {error && (
            <p style={{ fontSize: '0.78rem', color: '#fca5a5', margin: 0 }}>{error}</p>
          )}

          <Button variant="primary" type="submit" disabled={busy} style={{ width: '100%' }}>
            {busy ? a.loggingIn : a.loginBtn}
          </Button>
        </form>
      </div>
    </div>
  );
}
