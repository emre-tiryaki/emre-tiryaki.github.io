import { useTranslation } from '../../hooks/translation';

export default function LocationBadge() {
  const { t } = useTranslation();

  return (
    <span
      className="group relative inline-flex items-center justify-around gap-2 rounded-full select-none cursor-default whitespace-nowrap shrink-0"
      style={{
        padding: '0.5rem 1.25rem',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Pulsing location dot */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-50" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
      </span>

      {/* Location text */}
      <span className="text-sm font-semibold tracking-wide text-neutral-200">
        {t('about.location')}
      </span>
    </span>
  );
}
