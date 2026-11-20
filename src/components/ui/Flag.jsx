// Emoji bayrakları Windows'ta çizilmediği için tarayıcıdan bağımsız inline SVG bayraklar.
export default function Flag({ code, size = '1.15em', className = '' }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    className: `inline-block shrink-0 ${className}`,
    'aria-hidden': 'true',
    style: { borderRadius: '50%' },
  };

  if (code === 'tr') {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="12" fill="#E30A17" />
        <circle cx="9.2" cy="12" r="4.2" fill="#fff" />
        <circle cx="10.4" cy="12" r="3.4" fill="#E30A17" />
        <polygon fill="#fff" points="16.50,12.00 14.97,12.56 14.91,14.19 13.91,12.90 12.34,13.35 13.25,12.00 12.34,10.65 13.91,11.10 14.91,9.81 14.97,11.44" />
      </svg>
    );
  }

  // en → Birleşik Krallık
  return (
    <svg {...common}>
      <defs>
        <clipPath id="flag-gb-clip"><circle cx="12" cy="12" r="12" /></clipPath>
      </defs>
      <g clipPath="url(#flag-gb-clip)">
        <rect width="24" height="24" fill="#012169" />
        <path d="M0 0L24 24M24 0L0 24" stroke="#fff" strokeWidth="4.5" />
        <path d="M0 0L24 24M24 0L0 24" stroke="#C8102E" strokeWidth="1.8" />
        <path d="M12 0V24M0 12H24" stroke="#fff" strokeWidth="7" />
        <path d="M12 0V24M0 12H24" stroke="#C8102E" strokeWidth="4" />
      </g>
    </svg>
  );
}
