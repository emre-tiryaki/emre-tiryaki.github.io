import { useState } from 'react';
import { FiClock, FiGlobe } from 'react-icons/fi';
import { THEME_COLORS } from '../../theme';
import { useTranslation } from '../../hooks/translation';
import { isSafeAvatar } from '../../lib/guestbook';
import { cachedTranslations, translateComments } from '../../lib/commentTranslate';
import { teamExperiences, teamLinks } from '../../lib/guestbookLinks';
import CommentLinks from './CommentLinks';
import TeamBadge from './TeamBadge';

const { accent, surface, text, status } = THEME_COLORS;
const linkButton = {
  padding: 0,
  border: 0,
  background: 'none',
  font: 'inherit',
  color: accent.light,
  cursor: 'pointer',
  textDecoration: 'underline',
  textUnderlineOffset: '2px',
};

/**
 * Tek yorum kartı. İçerik düz metin olarak render edilir (HTML yorumlanmaz).
 * `comment.fallbackAvatar` fotoğrafı olmayan yorumlar için sayfa açılışında seçilir.
 */
export default function CommentCard({ comment, pending = false, large = false }) {
  const avatar = large ? 96 : 44;
  const { t, lang } = useTranslation();
  const [showOriginal, setShowOriginal] = useState(false);
  // Tek yorum çevirisi: { lang, text, source } veya { lang, failed: true }; site dili değişince geçersiz sayılır
  const [single, setSingle] = useState(null);
  const [singleBusy, setSingleBusy] = useState(false);
  const local = single?.lang === lang ? single : null;
  const globalTranslated = typeof comment.original === 'string';
  const originalText = globalTranslated ? comment.original : comment.message;
  const translatedText = globalTranslated ? comment.message : local?.text;
  const translated = typeof translatedText === 'string';
  const source = globalTranslated ? comment.translatedFrom : local?.source;
  const fromName = translated && source ? languageName(source, lang) : null;
  // Önbellek "zaten bu dilde" diyorsa çevir butonu gösterilmez
  const sameLang = !translated && (local?.text === null || cachedTranslations([comment], lang)[comment.id]?.text === null);
  const canTranslate = large && !translated && !sameLang && !!comment.message?.trim();

  const translateSingle = async () => {
    setSingleBusy(true);
    const target = lang;
    const res = (await translateComments([{ id: comment.id, message: originalText }], target))[comment.id];
    setSingle(res ? { lang: target, ...res } : { lang: target, failed: true });
    setShowOriginal(false);
    setSingleBusy(false);
  };
  const src = isSafeAvatar(comment.avatar) ? comment.avatar : comment.fallbackAvatar;
  const date = comment.createdAt
    ? new Date(comment.createdAt).toLocaleDateString(lang === 'en' ? 'en-GB' : 'tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  const hasLinks =
    Object.keys(comment.links || {}).length > 0 ||
    !!comment.publicEmail ||
    Object.keys(teamLinks(comment.teamMemberId)).length > 0 ||
    teamExperiences(comment.teamMemberId).length > 0;

  return (
    <article
      style={{
        display: 'flex',
        flexDirection: large ? 'column' : 'row',
        gap: large ? '1.25rem' : '0.9rem',
        padding: large ? '1.75rem' : '1rem 1.1rem',
        borderRadius: '1rem',
        background: THEME_COLORS.card.bg,
        border: `1px solid ${pending ? accent.borderSubtle : THEME_COLORS.card.border}`,
      }}
    >
      <div style={{ display: 'flex', gap: large ? '1.25rem' : '0.9rem', minWidth: 0, flex: 1 }}>
      {src ? (
        <img
          src={src}
          alt=""
          width={avatar}
          height={avatar}
          loading="lazy"
          decoding="async"
          style={{
            width: `${avatar / 16}rem`,
            height: `${avatar / 16}rem`,
            borderRadius: '50%',
            objectFit: 'cover',
            flexShrink: 0,
            border: `1px solid ${surface.white10}`,
          }}
        />
      ) : (
        <span
          aria-hidden="true"
          style={{
            width: `${avatar / 16}rem`,
            height: `${avatar / 16}rem`,
            borderRadius: '50%',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: accent.a15,
            color: accent.light,
            fontWeight: 700,
            fontSize: large ? '1.5rem' : undefined,
          }}
        >
          {comment.name.trim().charAt(0).toUpperCase()}
        </span>
      )}

      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.25rem 0.6rem' }}>
          <strong style={{ color: text.primary, fontSize: large ? '1.25rem' : '0.95rem', overflowWrap: 'anywhere' }}>
            {comment.name}
          </strong>
          <TeamBadge id={comment.teamMemberId} />
          {pending ? (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: large ? '0.85rem' : '0.7rem',
                fontWeight: 600,
                padding: '0.1rem 0.5rem',
                borderRadius: '999px',
                color: status.warningSoft,
                background: accent.a12,
                border: `1px solid ${accent.borderSubtle}`,
              }}
            >
              <FiClock aria-hidden="true" size={11} />
              {t('guestbook.pending')}
            </span>
          ) : (
            date && <span style={{ color: text.muted, fontSize: large ? '0.9rem' : '0.75rem' }}>{date}</span>
          )}
        </div>
        <p
          style={{
            margin: large ? '0.6rem 0 0' : '0.35rem 0 0',
            color: text.secondary,
            fontSize: large ? '1.15rem' : '0.9rem',
            lineHeight: large ? 1.7 : 1.6,
            whiteSpace: 'pre-wrap',
            overflowWrap: 'anywhere',
          }}
        >
          {translated && !showOriginal ? translatedText : originalText}
        </p>
        {(canTranslate || (large && sameLang && local)) && (
          <p
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              margin: '0.5rem 0 0',
              fontSize: '0.8rem',
              color: text.muted,
            }}
          >
            <FiGlobe aria-hidden="true" size={12} />
            {sameLang ? (
              t('guestbook.translate.same')
            ) : (
              <>
                <button type="button" onClick={translateSingle} disabled={singleBusy} aria-busy={singleBusy} style={linkButton}>
                  {singleBusy ? t('guestbook.translate.busy') : t('guestbook.translate.single')}
                </button>
                {local?.failed && !singleBusy && <span role="status">{t('guestbook.translate.failed')}</span>}
              </>
            )}
          </p>
        )}
        {translated && (
          <p
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: '0.4rem',
              margin: '0.5rem 0 0',
              fontSize: large ? '0.8rem' : '0.72rem',
              color: text.muted,
            }}
          >
            <FiGlobe aria-hidden="true" size={12} />
            {fromName ? t('guestbook.translate.from', { lang: fromName }) : t('guestbook.translate.translated')}
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setShowOriginal((v) => !v)}
              aria-pressed={showOriginal}
              style={linkButton}
            >
              {showOriginal ? t('guestbook.translate.showTranslation') : t('guestbook.translate.showOriginal')}
            </button>
          </p>
        )}
        {!large && (
          <CommentLinks links={comment.links} publicEmail={comment.publicEmail} teamMemberId={comment.teamMemberId} />
        )}
      </div>
      </div>
      {large && hasLinks && (
        <footer style={{ minWidth: 0, textAlign: 'center', paddingTop: '1.25rem', borderTop: `1px solid ${surface.white10}` }}>
          <CommentLinks panel links={comment.links} publicEmail={comment.publicEmail} teamMemberId={comment.teamMemberId} />
        </footer>
      )}
    </article>
  );
}

function languageName(code, uiLang) {
  try {
    return new Intl.DisplayNames([uiLang], { type: 'language' }).of(code) || code;
  } catch {
    return code;
  }
}
