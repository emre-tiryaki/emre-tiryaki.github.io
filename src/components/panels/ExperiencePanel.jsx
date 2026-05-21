import experience from '../../data/experience.json';

function ExperiencePanel() {
  const internships = experience.filter(e => e.type === 'internship');
  const events = experience.filter(e => e.type === 'hackathon' || e.type === 'competition');

  return (
    <div id="panel-experience">
      <h1 className="panel-title">Deneyim</h1>
      <p className="panel-subtitle">Profesyonel stajlar ve teknik etkinlikler</p>

      <h2 className="section-heading">Stajlar</h2>
      <div className="timeline">
        {internships.map(item => (
          <div className="timeline-item" key={item.id} data-type={item.type}>
            <div className="timeline-dot" />
            <div className="timeline-header">
              <span className="timeline-company">{item.company}</span>
              <span className="timeline-date">{item.startDate} – {item.endDate}</span>
            </div>
            <div className="timeline-role">{item.title}</div>
            {item.location && <div className="timeline-location">📍 {item.location}</div>}
          </div>
        ))}
      </div>

      <h2 className="section-heading">Hackathonlar & Yarışmalar</h2>
      <div className="timeline">
        {events.map(item => (
          <div className="timeline-item" key={item.id} data-type={item.type}>
            <div className="timeline-dot" />
            <div className="timeline-header">
              <span className="timeline-company">{item.company}</span>
              <span className="timeline-date">
                {item.date}
                {item.duration && <span className="timeline-duration">({item.duration})</span>}
              </span>
            </div>
            <div className="timeline-role">{item.title}</div>
            {item.location && <div className="timeline-location">📍 {item.location}</div>}
            {item.achievement && (
              <div className="timeline-achievement">🏆 {item.achievement}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExperiencePanel;
