import { FiAward } from 'react-icons/fi';
import { THEME_COLORS } from '../../theme';
import { useTranslation } from '../../hooks/translation';
import teamData from '../../data/team.json';

const { accent } = THEME_COLORS;

/** "Takım arkadaşı" rozeti. team.json'da olmayan id için hiçbir şey çizmez. */
export default function TeamBadge({ id, small = false }) {
  const { t } = useTranslation();
  if (!id || !teamData[id]) return null;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
        fontSize: small ? '0.62rem' : '0.72rem',
        fontWeight: 600,
        padding: '0.1rem 0.5rem',
        borderRadius: '999px',
        color: accent.light,
        background: accent.a15,
        border: `1px solid ${accent.borderSubtle}`,
        whiteSpace: 'nowrap',
      }}
    >
      <FiAward aria-hidden="true" size={small ? 9 : 11} />
      {t('guestbook.teammate')}
    </span>
  );
}
