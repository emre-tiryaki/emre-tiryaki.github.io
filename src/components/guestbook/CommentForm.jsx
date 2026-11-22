import { useEffect, useRef, useState } from 'react';
import { FiShuffle, FiUpload } from 'react-icons/fi';
import { THEME_COLORS } from '../../theme';
import { COMMENT_FALLBACK_AVATARS } from '../../lib/media';
import { useTranslation } from '../../hooks/translation';
import Button from '../ui/Button';
import FormField from '../ui/FormField';
import AvatarCropper from './AvatarCropper';
import {
  GUESTBOOK_LIMITS,
  cooldownRemaining,
  avatarUrlToDataUrl,
  isValidEmail,
  submitComment,
} from '../../lib/guestbook';

const { text, status } = THEME_COLORS;
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
  const [cropSrc, setCropSrc] = useState(null);
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

  const pickPhoto = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors((er) => ({ ...er, photo: t('guestbook.errors.photo') }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setErrors((er) => ({ ...er, photo: undefined }));
      setCropSrc(reader.result);
    };
    reader.onerror = () => setErrors((er) => ({ ...er, photo: t('guestbook.errors.photo') }));
    reader.readAsDataURL(file);
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

  if (cropSrc) {
    return (
      <AvatarCropper
        src={cropSrc}
        onCancel={() => setCropSrc(null)}
        onConfirm={(dataUrl) => {
          setAvatar({ type: 'custom', dataUrl });
          setCropSrc(null);
        }}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}
    >

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

      {/* Avatar: rastgele, hazır avatarlardan biri ya da kendi fotoğrafın (yuvarlak kırpılır, 96x96 WebP) */}
      <fieldset style={{ margin: 0, padding: 0, border: 0, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <legend style={{ padding: 0, marginBottom: '0.35rem', fontSize: '0.78rem', fontWeight: 600, color: '#a3a3a3' }}>
          {t('guestbook.form.photo')}
        </legend>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <label className="avatar-opt" title={t('guestbook.form.avatarRandom')}>
            <input type="radio" name="avatar" checked={!avatar} onChange={() => setAvatar(null)} />
            <span className="avatar-opt__face"><FiShuffle aria-hidden="true" /></span>
            <span className="sr-only">{t('guestbook.form.avatarRandom')}</span>
          </label>
          {COMMENT_FALLBACK_AVATARS.map((src, i) => (
            <label key={src} className="avatar-opt">
              <input
                type="radio"
                name="avatar"
                checked={avatar?.type === 'preset' && avatar.src === src}
                onChange={() => setAvatar({ type: 'preset', src })}
              />
              <span className="avatar-opt__face">
                <img src={src} alt="" width={48} height={48} loading="lazy" draggable={false} />
              </span>
              <span className="sr-only">{t('guestbook.form.avatarN', { n: i + 1 })}</span>
            </label>
          ))}
          {avatar?.type === 'custom' && (
            <label className="avatar-opt">
              <input type="radio" name="avatar" checked readOnly />
              <span className="avatar-opt__face">
                <img src={avatar.dataUrl} alt="" width={48} height={48} draggable={false} />
              </span>
              <span className="sr-only">{t('guestbook.form.photoPreview')}</span>
            </label>
          )}
          <input ref={fileRef} type="file" accept="image/*" onChange={pickPhoto} hidden aria-label={t('guestbook.form.photoChoose')} />
          <button
            type="button"
            className="avatar-opt avatar-opt--upload"
            onClick={() => fileRef.current?.click()}
            title={t('guestbook.form.photoChoose')}
          >
            <span className="avatar-opt__face"><FiUpload aria-hidden="true" /></span>
            <span className="sr-only">{avatar?.type === 'custom' ? t('guestbook.form.photoChange') : t('guestbook.form.photoChoose')}</span>
          </button>
        </div>
        <span style={{ fontSize: '0.72rem', color: text.muted }}>{t('guestbook.form.photoHelp')}</span>
        {errors.photo && <span role="alert" style={{ fontSize: '0.72rem', color: status.dangerSoft }}>{errors.photo}</span>}
      </fieldset>

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
    </form>
  );
}
