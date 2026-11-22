import { useEffect, useRef, useState } from 'react';
import { FiImage, FiX } from 'react-icons/fi';
import { THEME_COLORS } from '../../theme';
import { useTranslation } from '../../hooks/translation';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import {
  GUESTBOOK_LIMITS,
  cooldownRemaining,
  isValidEmail,
  resizeImageToDataUrl,
  submitComment,
} from '../../lib/guestbook';

const { surface, text, status, accent } = THEME_COLORS;
const EMPTY = { name: '', message: '', email: '', website: '' };

/**
 * Yorum formu. Yorum onaysız kaydedilir; başarıyla gönderilince `onSubmitted(yorum)` çağrılır.
 * `website` alanı honeypot: botlar doldurur, insanlar görmez.
 */
export default function CommentForm({ onSubmitted }) {
  const { t } = useTranslation();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text }
  const fileRef = useRef(null);
  const nameRef = useRef(null);

  // İlk hatalı alana odaklan
  const firstError = Object.keys(errors)[0];
  useEffect(() => {
    if (firstError === 'name') nameRef.current?.focus();
  }, [firstError, errors]);

  const setField = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const pickPhoto = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      setAvatar(await resizeImageToDataUrl(file));
      setErrors((er) => ({ ...er, photo: undefined }));
    } catch {
      setAvatar(null);
      setErrors((er) => ({ ...er, photo: t('guestbook.errors.photo') }));
    }
  };

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = t('guestbook.errors.name');
    if (!values.message.trim()) next.message = t('guestbook.errors.message');
    const email = values.email.trim();
    if (email && !isValidEmail(email)) next.email = t('guestbook.errors.email');
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (busy) return;
    setFeedback(null);

    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) return;

    // Honeypot dolu: gönderilmiş gibi davran, hiçbir şey yazma
    if (values.website) {
      setValues(EMPTY);
      return;
    }

    const wait = cooldownRemaining();
    if (wait > 0) {
      setFeedback({ type: 'error', text: t('guestbook.errors.cooldown', { seconds: wait }) });
      return;
    }

    setBusy(true);
    try {
      const mine = await submitComment({ ...values, avatar });
      setValues(EMPTY);
      setAvatar(null);
      setFeedback({ type: 'success', text: t('guestbook.success') });
      onSubmitted(mine);
    } catch {
      setFeedback({ type: 'error', text: t('guestbook.errors.submit') });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-labelledby="guestbook-form-title"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.9rem',
        padding: '1.25rem',
        borderRadius: '1rem',
        background: THEME_COLORS.card.bg,
        border: `1px solid ${THEME_COLORS.card.border}`,
      }}
    >
      <h2 id="guestbook-form-title" style={{ margin: 0, fontSize: '1.1rem', color: text.primary }}>
        {t('guestbook.form.title')}
      </h2>

      <FormField
        ref={nameRef}
        label={t('guestbook.form.name')}
        name="name"
        value={values.name}
        onChange={setField}
        error={errors.name}
        required
        maxLength={GUESTBOOK_LIMITS.name}
        autoComplete="nickname"
        aria-invalid={Boolean(errors.name)}
      />

      <FormField
        label={t('guestbook.form.message')}
        name="message"
        as="textarea"
        rows={4}
        value={values.message}
        onChange={setField}
        error={errors.message}
        required
        maxLength={GUESTBOOK_LIMITS.message}
        aria-invalid={Boolean(errors.message)}
      />
      <span style={{ marginTop: '-0.6rem', alignSelf: 'flex-end', fontSize: '0.72rem', color: text.muted }}>
        {values.message.length}/{GUESTBOOK_LIMITS.message}
      </span>

      <FormField
        label={t('guestbook.form.email')}
        name="email"
        type="email"
        value={values.email}
        onChange={setField}
        error={errors.email}
        placeholder={t('guestbook.form.emailPlaceholder')}
        help={t('guestbook.form.emailHelp')}
        maxLength={GUESTBOOK_LIMITS.email}
        autoComplete="email"
        aria-invalid={Boolean(errors.email)}
      />

      {/* Fotoğraf: tarayıcıda 96x96 WebP'ye küçültülür, dosya boyutu sınırı yok */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#a3a3a3' }}>
          {t('guestbook.form.photo')}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {avatar && (
            <img
              src={avatar}
              alt={t('guestbook.form.photoPreview')}
              width={48}
              height={48}
              style={{ width: '3rem', height: '3rem', borderRadius: '50%', objectFit: 'cover', border: `1px solid ${surface.white10}` }}
            />
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={pickPhoto}
            hidden
            aria-label={t('guestbook.form.photo')}
          />
          <Button type="button" variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
            <FiImage aria-hidden="true" /> {avatar ? t('guestbook.form.photoChange') : t('guestbook.form.photoChoose')}
          </Button>
          {avatar && (
            <Button type="button" variant="ghost" size="sm" onClick={() => setAvatar(null)}>
              <FiX aria-hidden="true" /> {t('guestbook.form.photoRemove')}
            </Button>
          )}
        </div>
        <span style={{ fontSize: '0.72rem', color: text.muted }}>{t('guestbook.form.photoHelp')}</span>
        {errors.photo && <span role="alert" style={{ fontSize: '0.72rem', color: status.dangerSoft }}>{errors.photo}</span>}
      </div>

      {/* Honeypot: ekran okuyuculardan ve klavyeden gizli */}
      <div aria-hidden="true" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)', opacity: 0, pointerEvents: 'none' }}>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => setField('website', e.target.value)}
        />
      </div>

      <p style={{ margin: 0, fontSize: '0.78rem', color: accent.lighter }}>{t('guestbook.form.notice')}</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Button type="submit" variant="primary" disabled={busy}>
          {busy ? t('guestbook.form.submitting') : t('guestbook.form.submit')}
        </Button>
        <div role="status" aria-live="polite" style={{ fontSize: '0.82rem', color: feedback?.type === 'error' ? status.dangerSoft : status.successSoft }}>
          {feedback?.text}
        </div>
      </div>
    </form>
  );
}
