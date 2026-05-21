import { useState, useEffect } from 'react';
import experience from '../../data/experience.json';
import pointingGuy from '../../assets/experience/Guy_pointing_meme.png';

const TYPE_CONFIG = {
  internship: { label: 'Staj', color: 'var(--accent)' },
  hackathon: { label: 'Hackathon', color: 'var(--accent-peach)' },
  competition: { label: 'Yarışma', color: 'var(--accent-yellow)' },
};

/**
 * CTA variants for the top of the timeline.
 * Add new objects here to expand the rotation.
 * Each variant: { image, title, subtitle }
 */
const CTA_VARIANTS = [
  {
    image: pointingGuy,
    title: 'Sıradaki deneyimim siz olabilirsiniz',
    subtitle: 'Bana ulaşın',
  },
  // Add more variants here, e.g.:
  // {
  //   image: someOtherImage,
  //   title: 'Birlikte harika projeler yaratalım',
  //   subtitle: 'İletişime geçin',
  // },
];

function TimelineCTA() {
  const [variant, setVariant] = useState(null);

  useEffect(() => {
    const idx = Math.floor(Math.random() * CTA_VARIANTS.length);
    setVariant(CTA_VARIANTS[idx]);
  }, []);

  if (!variant) return null;

  return (
    <div className="exp-timeline-item" style={{ '--exp-accent': 'var(--accent-green)' }}>
      <div className="exp-timeline-dot" />
      <div className="exp-tl-card exp-cta-card">
        <img src={variant.image} alt="" className="exp-cta-img" />
        <div className="exp-cta-text">
          <div className="exp-cta-title">{variant.title}</div>
          <div className="exp-cta-sub">{variant.subtitle}</div>
        </div>
      </div>
    </div>
  );
}

function ExperiencePanel() {
  const sorted = [...experience].sort((a, b) => {
    const dateA = a.startDate || a.date || '';
    const dateB = b.startDate || b.date || '';
    return dateB.localeCompare(dateA);
  });

  return (
    <div id="panel-experience">
      <h1 className="panel-title">Deneyim</h1>
      <p className="panel-subtitle">Profesyonel stajlar ve teknik etkinlikler</p>

      <div className="exp-timeline">
        <TimelineCTA />

        {sorted.map(item => {
          const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.internship;
          const dateText = item.startDate
            ? `${item.startDate} – ${item.endDate}`
            : item.date + (item.duration ? ` (${item.duration})` : '');

          return (
            <div className="exp-timeline-item" key={item.id} style={{ '--exp-accent': config.color }}>
              <div className="exp-timeline-dot" />
              <div className="exp-tl-card">
                <div className="exp-tl-header">
                  <h3 className="exp-tl-company">{item.company}</h3>
                  <span className="exp-tl-type">{config.label}</span>
                </div>
                <div className="exp-tl-role">{item.title}</div>
                <div className="exp-tl-meta">
                  <span>📅 {dateText}</span>
                  {item.location && <span>📍 {item.location}</span>}
                </div>
                {item.achievement && (
                  <div className="exp-tl-achievement">🏆 {item.achievement}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ExperiencePanel;
