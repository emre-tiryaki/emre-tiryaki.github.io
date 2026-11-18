import Button from './Button';
import { THEME_COLORS } from '../../theme';

const { accent } = THEME_COLORS;

/**
 * Dar ekranlarda master/detail sayfalarının sağ filtre kenar çubuğunun yerini alan
 * yatay, satıra sığmazsa alt satıra geçen filtre çipleri.
 *
 * @param {{ key: string, label: string, color?: string|null }[]} options
 */
export default function FilterChips({ label, options, active, onChange }) {
  return (
    <div
      role="group"
      aria-label={label}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '0.5rem',
        paddingBottom: '0.75rem',
        flexShrink: 0,
      }}
    >
      {options.map(({ key, label: chipLabel, color }) => {
        const isActive = active === key;
        const tone = color || accent.primary;
        return (
          <Button
            key={key}
            variant="secondary"
            size="sm"
            aria-pressed={isActive}
            onClick={() => onChange(key)}
            style={{
              minHeight: '2.5rem',
              gap: '0.45rem',
              background: isActive ? `${tone}20` : 'rgba(255,255,255,0.04)',
              boxShadow: isActive ? `inset 0 0 0 1px ${tone}70` : 'inset 0 0 0 1px rgba(255,255,255,0.08)',
              color: isActive ? tone : '#94a3b8',
            }}
          >
            {color && (
              <span
                aria-hidden="true"
                style={{
                  width: '0.5rem',
                  height: '0.5rem',
                  borderRadius: '50%',
                  flexShrink: 0,
                  background: color,
                  boxShadow: isActive ? `0 0 8px ${color}` : 'none',
                }}
              />
            )}
            {chipLabel}
          </Button>
        );
      })}
    </div>
  );
}
