import { useCallback, useEffect, useRef, useState } from 'react';
import { FiEdit2, FiShuffle } from 'react-icons/fi';
import { THEME_COLORS } from '../../theme';
import { useTranslation } from '../../hooks/translation';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import AvatarPicker from './AvatarPicker';
import {
  GUESTBOOK_LIMITS,
  cooldownRemaining,
  avatarUrlToDataUrl,
  isValidEmail,
  submitComment,
} from '../../lib/guestbook';

const { text, surface, accent } = THEME_COLORS;
const EMPTY = { name: '', message: '', email: '', website: '' };

/**
 * Yorum formu. Yorum onaysız kaydedilir; başarıyla gönderilince `onSubmitted(yorum)` çağrılır.
 * `website` alanı honeypot: botlar doldurur, insanlar görmez.
 */
export default function CommentForm({ onSubmitted }) {
  const { t } = useTranslation();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  // Avatar seçimi: null = rastgele, { type: 'preset', src } hazır avatar, { type: 'custom', dataUrl } kırpılmış yükleme
  const [avatar, setAvatar] = useState(null);
  const [picking, setPicking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', text }
  const nameRef = useRef(null);

  // İlk hatalı alana odaklan
  const firstError = Object.keys(errors)[0];
  useEffect(() => {
    if (firstError === 'name') nameRef.current?.focus();
  }, [firstError, errors]);

  const setField = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const closePicker = useCallback(() => setPicking(false), []);
  const avatarSrc = avatar ? (avatar.type === 'custom' ? avatar.dataUrl : avatar.src) : null;

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
      const dataUrl = !avatar ? null : avatar.type === 'custom' ? avatar.dataUrl : await avatarUrlToDataUrl(avatar.src);
      const mine = await submitComment({ ...values, avatar: dataUrl });
      setValues(EMPTY);
      setAvatar(null);
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
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}
    >

      {/* Avatar: tek yuvarlak önizleme; tıklayınca seçenekler ayrı modalda açılır */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
        <button
          type="button"
          onClick={() => setPicking(true)}
          aria-label={t('guestbook.form.avatarChange')}
          aria-haspopup="dialog"
          className="avatar-main"
        >
          <span className="avatar-main__face" style={{ borderColor: surface.white10 }}>
            {avatarSrc ? <img src={avatarSrc} alt="" width={96} height={96} draggable={false} /> : <FiShuffle aria-hidden="true" size={28} />}
          </span>
          <span className="avatar-main__badge" style={{ background: accent.primary }}><FiEdit2 aria-hidden="true" size={13} /></span>
        </button>
        <span style={{ fontSize: '0.72rem', color: text.muted }}>
          {avatar ? t('guestbook.form.avatarChange') : t('guestbook.form.avatarRandomHint')}
        </span>
      </div>

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

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Button type="submit" variant="primary" disabled={busy}>
          {busy ? t('guestbook.form.submitting') : t('guestbook.form.submit')}
        </Button>
        <div role="status" aria-live="polite" style={{ fontSize: '0.82rem', color: feedback?.type === 'error' ? status.dangerSoft : status.successSoft }}>
          {feedback?.text}
        </div>
      </div>
      {picking && <AvatarPicker value={avatar} onChange={setAvatar} onClose={closePicker} />}
    </form>
  );
}
