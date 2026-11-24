import { useState } from 'react';
import { FiLock } from 'react-icons/fi';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import { useTranslation } from '../../hooks/translation';
import { THEME_COLORS } from '../../theme';
import { signIn } from '../../lib/admin';

const { text, accent, card, status } = THEME_COLORS;

export default function LoginForm() {
  const { t } = useTranslation();
  const [values, setValues] = useState({ email: '', password: '' });
  const [remember, setRemember] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  const setField = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(false);
    try {
      await signIn(values.email.trim(), values.password, remember);
    } catch {
      setError(true); // tek genel mesaj: hesap varlığı sızdırılmaz
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      style={{
        width: '100%',
        maxWidth: '24rem',
        margin: '1rem auto 0',
        padding: '2rem 1.75rem',
        display: 'grid',
        gap: '1.1rem',
        borderRadius: card.radius,
        background: card.bg,
        border: `1px solid ${card.border}`,
        boxShadow: card.shadow,
        boxSizing: 'border-box',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          justifySelf: 'center',
          width: '3rem',
          height: '3rem',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: accent.light,
          background: accent.a12,
          border: `1px solid ${accent.borderSubtle}`,
        }}
      >
        <FiLock size={20} />
      </span>

      <FormField
        label={t('admin.login.email')}
        name="email"
        type="email"
        autoComplete="username"
        required
        autoFocus
        value={values.email}
        onChange={setField}
      />
      <FormField
        label={t('admin.login.password')}
        name="password"
        type="password"
        autoComplete="current-password"
        required
        value={values.password}
        onChange={setField}
      />

      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: text.secondary,
          fontSize: '0.85rem',
          cursor: 'pointer',
        }}
      >
        <input
          type="checkbox"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          style={{ accentColor: accent.primary, width: '1rem', height: '1rem' }}
        />
        {t('admin.login.remember')}
      </label>

      {error && (
        <p
          role="alert"
          style={{
            margin: 0,
            padding: '0.6rem 0.8rem',
            borderRadius: '0.75rem',
            color: status.dangerSoft,
            background: status.dangerBg,
            border: `1px solid ${status.dangerBorder}`,
            fontSize: '0.85rem',
          }}
        >
          {t('admin.login.error')}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" disabled={busy}>
        {busy ? t('admin.login.submitting') : t('admin.login.submit')}
      </Button>
    </form>
  );
}
