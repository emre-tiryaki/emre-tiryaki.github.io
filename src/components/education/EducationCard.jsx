import { FiCalendar, FiAward, FiCode, FiLayers, FiCpu, FiGlobe, FiCheck } from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';
import { THEME_COLORS } from '../../theme';
import { getEducationLogo, CATEGORY_ICONS } from '../../lib/media';

const { accent, surface, text, status: themeStatus, card } = THEME_COLORS;

export default function EducationCard({
  school,
  logo,
  degree,
  field,
  status,
  startDate,
  endDate,
  gpa,
  specializations,
  courseCategories,
}) {
  const { t, tData } = useTranslation();

  return (
    <div
      style={{
        width: '100%',
        borderRadius: card.radius,
        border: `1px solid ${card.border}`,
        background: card.bg,
        padding: '1.75rem 2rem',
        boxShadow: card.shadow,
        display: 'flex',
        flexDirection: 'column',
        gap: '1.35rem',
        userSelect: 'none',
        cursor: 'default',
        transition: 'all 0.25s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = card.borderHover;
        e.currentTarget.style.background = card.bgHover;
        e.currentTarget.style.boxShadow = card.shadowHover;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = card.border;
        e.currentTarget.style.background = card.bg;
        e.currentTarget.style.boxShadow = card.shadow;
      }}
    >
      {/* ── TOP: School Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Logo */}
        <div style={{ position: 'relative', width: '4.5rem', height: '4.5rem', flexShrink: 0 }}>
          <div
            style={{
              position: 'absolute',
              inset: '-3px',
              borderRadius: '1.15rem',
              background: 'radial-gradient(circle, rgba(249,115,22,0.25) 0%, transparent 70%)',
              filter: 'blur(6px)',
              zIndex: 0,
            }}
          />
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              width: '4.5rem',
              height: '4.5rem',
              borderRadius: '1rem',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}
          >
            <img
              src={logo ? new URL(`../../assets/education/${logo}`, import.meta.url).href : getEducationLogo()}
              alt={tData(school)}
              draggable={false}
              style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
            />
          </div>
        </div>

        {/* 2 Lines on Right */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '0.65rem' }}>
          {/* Line 1: School Name + Degree on Left, 4. Sınıf + Date + GPA on Right */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            {/* Left: School Name & Degree in Single Line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.55rem', fontWeight: 800, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
                {tData(school)}
              </h2>
              <span style={{ color: '#475569', fontWeight: 700, fontSize: '1.35rem' }}>·</span>
              <span
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  background: 'linear-gradient(90deg, #fb923c 0%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.01em',
                }}
              >
                {tData(degree)} — {tData(field)}
              </span>
            </div>

            {/* Right: 4. Sınıf Pill + Date + GPA */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'nowrap' }}>
              {status && (
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.35rem 0.8rem',
                    borderRadius: '0.65rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    background: themeStatus.successBg,
                    border: `1px solid ${themeStatus.successBorder}`,
                    color: themeStatus.successSoft,
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
                  {tData(status)}
                </span>
              )}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '0.65rem',
                  background: surface.white05,
                  border: `1px solid ${surface.white10}`,
                  fontSize: '0.85rem',
                  color: '#e2e8f0',
                  whiteSpace: 'nowrap',
                }}
              >
                <FiCalendar className="text-neutral-400" size={14} />
                {tData(startDate)} – {tData(endDate)}
              </span>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.35rem 0.95rem',
                  borderRadius: '0.65rem',
                  background: accent.a15,
                  border: `1px solid ${accent.a40}`,
                  color: accent.light,
                  fontWeight: 800,
                  fontSize: '0.875rem',
                  whiteSpace: 'nowrap',
                }}
              >
                <FiAward className="text-orange-400" size={15} />
                {t('education.gpa')}: {gpa}
              </span>
            </div>
          </div>

          {/* Line 2: Engineering Specialization Pills */}
          {specializations && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              {specializations.map((spec, i) => (
                <span
                  key={i}
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '0.5rem',
                    background: surface.white03,
                    border: `1px solid ${surface.white08}`,
                    fontSize: '0.775rem',
                    fontWeight: 600,
                    color: '#cbd5e1',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {tData(spec)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── 4 Key Coursework Domains: 2-Column Natural Flow ── */}
      {courseCategories && (
        <div
          style={{
            columns: '2',
            columnGap: '1rem',
          }}
        >
          {courseCategories.map((cat) => {
            const IconComp = CATEGORY_ICONS[cat.id] || FiCode;
            return (
              <div
                key={cat.id}
                style={{
                  breakInside: 'avoid',
                  marginBottom: '1rem',
                  display: 'inline-block',
                  width: '100%',
                  padding: '1rem 1.15rem',
                  borderRadius: '1rem',
                  background: surface.white025,
                  border: `1px solid ${cat.accent ? `${cat.accent}25` : surface.white07}`,
                  transition: 'border-color 0.2s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    paddingBottom: '0.5rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                    marginBottom: '0.55rem',
                  }}
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '0.45rem',
                      background: cat.accent ? `${cat.accent}18` : accent.a15,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: cat.accent || accent.primary,
                    }}
                  >
                    <IconComp size={14} />
                  </div>
                  <h3
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      color: '#f1f5f9',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      margin: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {tData(cat.title)}
                  </h3>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {cat.courses.map((course, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.55rem',
                        padding: '0.4rem 0.65rem',
                        borderRadius: '0.5rem',
                        background: surface.white03,
                        border: `1px solid ${surface.white04}`,
                        fontSize: '0.85rem',
                        color: text.primary,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', minWidth: 0 }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: cat.accent || '#f97316', flexShrink: 0 }} />
                        <span
                          style={{
                            fontWeight: 600,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {tData(course.name)}
                        </span>
                      </div>
                      {course.tag && (
                        <span
                          style={{
                            fontSize: '0.675rem',
                            color: text.secondary,
                            background: surface.white04,
                            padding: '0.1rem 0.45rem',
                            borderRadius: '0.3rem',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                          }}
                        >
                          {course.tag}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
