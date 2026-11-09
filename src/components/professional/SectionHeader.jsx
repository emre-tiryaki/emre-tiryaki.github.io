export default function SectionHeader({ tag, title, subtitle, center = false }) {
  return (
    <div className={`pwm-section-header ${center ? 'pwm-section-header--center' : ''}`}>
      {tag && <span className="pwm-eyebrow">{tag}</span>}
      <h2 className="pwm-h2">{title}</h2>
      {subtitle && <p className="pwm-lead">{subtitle}</p>}
    </div>
  );
}
