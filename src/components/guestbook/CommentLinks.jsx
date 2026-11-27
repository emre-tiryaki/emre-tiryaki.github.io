import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiBriefcase, FiMail } from 'react-icons/fi';
import { THEME_COLORS } from '../../theme';
import { useTranslation } from '../../hooks/translation';
import { LINK_KEYS, LINK_TYPES, teamExperiences, teamLinks } from '../../lib/guestbookLinks';

const { text, surface, accent } = THEME_COLORS;

/** Yorumcunun linkleri (takım arkadaşıysa team.json linkleri eksikleri tamamlar) + herkese açık e-postası, ikon satırı. Yeni sekme, nofollow. */
export default function CommentLinks({ links = {}, publicEmail = null, teamMemberId = null, size = 16, panel = false }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  links = { ...teamLinks(teamMemberId), ...links };
  const entries = LINK_KEYS.filter((k) => links[k]);
  const experiences = teamExperiences(teamMemberId);
  if (entries.length === 0 && !publicEmail && experiences.length === 0) return null;

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.9rem',
    height: '1.9rem',
    borderRadius: '50%',
    color: text.secondary,
    border: `1px solid ${surface.white10}`,
  };

  if (panel) {
    // Chip ortak stili (kompakt, hap şeklinde)
    const chip = {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      padding: '0.3rem 0.7rem',
      borderRadius: '999px',
      fontSize: '0.8rem',
      color: text.primary,
      textDecoration: 'none',
      background: surface.white05,
      border: `1px solid ${surface.white10}`,
    };
    const list = { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexWrap: 'wrap', gap: '0.4rem' };
    const hint = (url) => {
      try {
        const u = new URL(url);
        return (u.host + u.pathname).replace(/\/$/, '');
      } catch {
        return url;
      }
    };
    const shown = expanded ? experiences : experiences.slice(0, 4);
    const hidden = experiences.length - 4;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {experiences.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.7rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: accent.light }}>
              <FiBriefcase aria-hidden="true" size={12} />
              {t('guestbook.experienceTitle')}
            </span>
            <ul style={list}>
              {shown.map((e) => (
                <li key={e.id}>
                  <Link
                    to={`/experience?exp=${encodeURIComponent(e.id)}`}
                    title={`${e.company} — ${t('guestbook.viewExperience')}`}
                    aria-label={`${e.company} — ${t('guestbook.viewExperience')}`}
                    style={{ ...chip, background: accent.a12, border: `1px solid ${accent.borderSubtle}` }}
                  >
                    {e.company}
                  </Link>
                </li>
              ))}
              {hidden > 0 && (
                <li>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setExpanded((v) => !v)}
                    style={{ ...chip, cursor: 'pointer', fontFamily: 'inherit', color: accent.light, background: accent.a12, border: `1px solid ${accent.borderSubtle}` }}
                  >
                    {expanded ? t('guestbook.showLess') : `+${hidden}`}
                  </button>
                </li>
              )}
            </ul>
          </div>
        )}
        {(entries.length > 0 || publicEmail) && (
          <ul style={list}>
            {entries.map((key) => {
              const Icon = LINK_TYPES[key].icon;
              return (
                <li key={key}>
                  <a href={links[key]} target="_blank" rel="noopener noreferrer nofollow ugc" title={hint(links[key])} style={chip}>
                    <Icon aria-hidden="true" size={14} color={accent.light} />
                    <span style={{ fontWeight: 600 }}>{t(`guestbook.linkTypes.${key}`)}</span>
                  </a>
                </li>
              );
            })}
            {publicEmail && (
              <li>
                <a href={`mailto:${publicEmail}`} title={publicEmail} style={chip}>
                  <FiMail aria-hidden="true" size={14} color={accent.light} />
                  <span style={{ fontWeight: 600 }}>E-mail</span>
                </a>
              </li>
            )}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
      {entries.map((key) => {
        const Icon = LINK_TYPES[key].icon;
        return (
          <a
            key={key}
            href={links[key]}
            target="_blank"
            rel="noopener noreferrer nofollow ugc"
            aria-label={t(`guestbook.linkTypes.${key}`)}
            title={t(`guestbook.linkTypes.${key}`)}
            style={style}
          >
            <Icon aria-hidden="true" size={size} />
          </a>
        );
      })}
      {experiences.slice(0, 2).map((e) => (
        <Link
          key={e.id}
          to={`/experience?exp=${encodeURIComponent(e.id)}`}
          title={e.company}
          style={{ ...style, width: 'auto', borderRadius: '999px', padding: '0 0.65rem', gap: '0.35rem', fontSize: '0.75rem' }}
        >
          <FiBriefcase aria-hidden="true" size={size - 3} />
          {e.company}
        </Link>
      ))}
      {experiences.length > 2 && (
        <span
          title={experiences.slice(2).map((e) => e.company).join(', ')}
          style={{ ...style, width: 'auto', borderRadius: '999px', padding: '0 0.65rem', fontSize: '0.75rem' }}
        >
          +{experiences.length - 2}
        </span>
      )}
      {publicEmail && (
        <a href={`mailto:${publicEmail}`} aria-label={publicEmail} title={publicEmail} style={style}>
          <FiMail aria-hidden="true" size={size} />
        </a>
      )}
    </div>
  );
}
