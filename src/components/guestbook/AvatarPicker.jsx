import { useRef, useState } from 'react';
import { FiShuffle, FiUpload } from 'react-icons/fi';
import { THEME_COLORS } from '../../theme';
import { useTranslation } from '../../hooks/translation';
import { COMMENT_FALLBACK_AVATARS } from '../../lib/media';
import Modal from '../ui/Modal';
import AvatarCropper from './AvatarCropper';

const { text, status } = THEME_COLORS;

/**
 * Avatar seçim modalı: rastgele, hazır avatarlar ya da fotoğraf yükle (yuvarlak kırpılır).
 * `value`: null | { type: 'preset', src } | { type: 'custom', dataUrl }. Seçince `onChange` + `onClose`.
 */
export default function AvatarPicker({ value, onChange, onClose }) {
  const { t } = useTranslation();
  const fileRef = useRef(null);
  const [cropSrc, setCropSrc] = useState(null);
  const [error, setError] = useState(null);

  const choose = (next) => {
    onChange(next);
    onClose();
  };

  const pickFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError(t('guestbook.errors.photo'));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setError(null);
      setCropSrc(reader.result);
    };
    reader.onerror = () => setError(t('guestbook.errors.photo'));
    reader.readAsDataURL(file);
  };

  return (
    <Modal title={t('guestbook.form.avatarTitle')} onClose={onClose} maxWidth="26rem">
      {cropSrc ? (
        <AvatarCropper
          src={cropSrc}
          onCancel={() => setCropSrc(null)}
          onConfirm={(dataUrl) => choose({ type: 'custom', dataUrl })}
        />
      ) : (
        <fieldset style={{ margin: 0, padding: 0, border: 0, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <legend className="sr-only">{t('guestbook.form.avatarTitle')}</legend>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', justifyContent: 'center' }}>
            <label className="avatar-opt" title={t('guestbook.form.avatarRandom')}>
              <input type="radio" name="avatar" data-autofocus={!value || undefined} checked={!value} onChange={() => choose(null)} />
              <span className="avatar-opt__face"><FiShuffle aria-hidden="true" /></span>
              <span className="sr-only">{t('guestbook.form.avatarRandom')}</span>
            </label>
            {COMMENT_FALLBACK_AVATARS.map((src, i) => {
              const checked = value?.type === 'preset' && value.src === src;
              return (
                <label key={src} className="avatar-opt">
                  <input type="radio" name="avatar" data-autofocus={checked || undefined} checked={checked} onChange={() => choose({ type: 'preset', src })} />
                  <span className="avatar-opt__face">
                    <img src={src} alt="" width={48} height={48} draggable={false} />
                  </span>
                  <span className="sr-only">{t('guestbook.form.avatarN', { n: i + 1 })}</span>
                </label>
              );
            })}
            {value?.type === 'custom' && (
              <label className="avatar-opt">
                <input type="radio" name="avatar" checked readOnly />
                <span className="avatar-opt__face">
                  <img src={value.dataUrl} alt="" width={48} height={48} draggable={false} />
                </span>
                <span className="sr-only">{t('guestbook.form.photoPreview')}</span>
              </label>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={pickFile} hidden aria-label={t('guestbook.form.photoChoose')} />
            <button type="button" className="avatar-opt avatar-opt--upload" onClick={() => fileRef.current?.click()} title={t('guestbook.form.photoChoose')}>
              <span className="avatar-opt__face"><FiUpload aria-hidden="true" /></span>
              <span className="sr-only">{t('guestbook.form.photoChoose')}</span>
            </button>
          </div>
          <span style={{ fontSize: '0.72rem', color: text.muted, textAlign: 'center' }}>{t('guestbook.form.photoHelp')}</span>
          {error && <span role="alert" style={{ fontSize: '0.72rem', color: status.dangerSoft, textAlign: 'center' }}>{error}</span>}
        </fieldset>
      )}
    </Modal>
  );
}
