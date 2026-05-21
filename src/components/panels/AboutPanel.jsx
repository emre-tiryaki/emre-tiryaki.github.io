import { useState } from 'react';
import profile from '../../data/profile.json';
import { VscGithubInverted, VscMail, VscLinkExternal } from 'react-icons/vsc';

const photoModules = import.meta.glob(
  '../../assets/personal_photos/*.{jpg,jpeg,png}',
  { eager: true, import: 'default' }
);

const photos = Object.entries(photoModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

function PhotoCarousel() {
  const [index, setIndex] = useState(0);
  const total = photos.length;

  if (total === 0) {
    return (
      <div className="photo-carousel-wrap">
        <div className="photo-carousel-empty">Fotoğraf bulunamadı</div>
      </div>
    );
  }

  const handlePrev = () => setIndex(prev => (prev - 1 + total) % total);
  const handleNext = () => setIndex(prev => (prev + 1) % total);

  const leftIndex = (index - 1 + total) % total;
  const rightIndex = (index + 1) % total;

  const getSlot = (i) => {
    if (i === index) return 'center';
    if (i === leftIndex) return 'left';
    if (i === rightIndex) return 'right';
    return 'hidden';
  };

  return (
    <div className="photo-carousel-wrap" id="photo-carousel">
      <div className="photo-carousel-track">
        {photos.map((photo, i) => {
          const slot = getSlot(i);
          return (
            <div key={photo} className={`photo-slide photo-slide--${slot}`}>
              <img src={photo} alt={`${profile.firstName} ${profile.lastName}`} />
            </div>
          );
        })}
      </div>

      {total > 1 && (
        <>
          <button className="carousel-btn prev" onClick={handlePrev} aria-label="Önceki fotoğraf">←</button>
          <button className="carousel-btn next" onClick={handleNext} aria-label="Sonraki fotoğraf">→</button>
          <div className="carousel-dots">
            {photos.map((_, i) => (
              <button
                key={i}
                className={`carousel-dot${i === index ? ' active' : ''}`}
                onClick={() => setIndex(i)}
                aria-label={`Fotoğraf ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function AboutPanel() {
  return (
    <div id="panel-about">
      <h1 className="panel-title">{profile.firstName} {profile.lastName}</h1>
      <p className="panel-subtitle">{profile.headline}</p>

      <div className="about-header">
        <PhotoCarousel />

        <div className="about-info">
          <p className="about-location">📍 {profile.location}</p>
          <p className="about-summary">{profile.summary}</p>

          <div className="about-links">
            <a href={`mailto:${profile.contact.email}`} className="about-link" id="link-email">
              <VscMail /> {profile.contact.email}
            </a>
            <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="about-link" id="link-github">
              <VscGithubInverted /> GitHub
            </a>
            <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="about-link" id="link-linkedin">
              <VscLinkExternal /> LinkedIn
            </a>
            {profile.socialLinks.x && (
              <a href={profile.socialLinks.x} target="_blank" rel="noreferrer" className="about-link" id="link-x">
                𝕏 Twitter / X
              </a>
            )}
            {profile.socialLinks.instagram && (
              <a href={profile.socialLinks.instagram} target="_blank" rel="noreferrer" className="about-link" id="link-instagram">
                📷 Instagram
              </a>
            )}
          </div>
        </div>
      </div>

      <h2 className="section-heading">Eğitim</h2>
      <div className="info-grid">
        {profile.education.map(edu => (
          <div className="edu-card card-hover" key={edu.id}>
            <div className="edu-school">{edu.school}</div>
            <div className="edu-field">{edu.degree} — {edu.fieldOfStudy}</div>
            <div className="edu-details">
              <div>{edu.startDate} – {edu.endDate}</div>
              <div>GPA: {edu.gpa}</div>
              {edu.activities && <div>Kulüpler: {edu.activities}</div>}
            </div>
          </div>
        ))}
      </div>

      <h2 className="section-heading">Konuşulan Diller</h2>
      <div className="info-grid">
        {profile.languages.map(lang => (
          <div className="lang-card card-hover" key={lang.name}>
            <div className="lang-name">{lang.name}</div>
            <div className="lang-level">{lang.proficiency}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AboutPanel;
