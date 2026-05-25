import { useState, useEffect } from "react";
import profile from "../../data/profile.json";
import inonuLogo from "../../assets/education/inonu_university_logo.png";
import { VscGithubInverted, VscMail, VscLinkExternal } from "react-icons/vsc";

const photoModules = import.meta.glob(
    "../../assets/personal_photos/*.{jpg,jpeg,png}",
    { eager: true, import: "default" },
);

const photos = Object.entries(photoModules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, src]) => src);

const CAROUSEL_KEY = "portfolio-carousel-index";

function PhotoCarousel() {
    const [index, setIndex] = useState(() => {
        const saved = parseInt(localStorage.getItem(CAROUSEL_KEY), 10);
        return saved >= 0 && saved < photos.length ? saved : 0;
    });
    const total = photos.length;

    useEffect(() => {
        localStorage.setItem(CAROUSEL_KEY, String(index));
    }, [index]);

    if (total === 0) {
        return (
            <div className="carousel-container">
                <div className="photo-carousel-empty">Fotoğraf bulunamadı</div>
            </div>
        );
    }

    const handlePrev = () => setIndex((prev) => (prev - 1 + total) % total);
    const handleNext = () => setIndex((prev) => (prev + 1) % total);

    const leftIndex = (index - 1 + total) % total;
    const rightIndex = (index + 1) % total;

    const getSlot = (i) => {
        if (i === index) return "center";
        if (i === leftIndex) return "left";
        if (i === rightIndex) return "right";
        return "hidden";
    };

    return (
        <div className="carousel-container" id="photo-carousel">
            <div className="carousel-stage">
                {photos.map((photo, i) => {
                    const slot = getSlot(i);
                    return (
                        <div
                            key={photo}
                            className={`carousel-slide carousel-slide--${slot}`}
                        >
                            <img
                                src={photo}
                                alt={`${profile.firstName} ${profile.lastName}`}
                                draggable="false"
                            />
                        </div>
                    );
                })}
            </div>

            {total > 1 && (
                <>
                    <button
                        className="carousel-arrow carousel-arrow--prev"
                        onClick={handlePrev}
                        aria-label="Önceki fotoğraf"
                    >
                        ‹
                    </button>
                    <button
                        className="carousel-arrow carousel-arrow--next"
                        onClick={handleNext}
                        aria-label="Sonraki fotoğraf"
                    >
                        ›
                    </button>
                    <div className="carousel-indicators">
                        {photos.map((_, i) => (
                            <button
                                key={i}
                                className={`carousel-indicator${i === index ? " active" : ""}`}
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
            <div className="about-header">
                <PhotoCarousel />

                <div className="about-info">
                    <h1 className="about-name">
                        {profile.firstName} {profile.lastName}
                    </h1>
                    <p className="about-headline-text">{profile.headline}</p>
                    <p className="about-location">📍 {profile.location}</p>
                    <p className="about-summary">{profile.summary}</p>

                    <div className="about-links">
                        <a
                            href={`mailto:${profile.contact.email}`}
                            className="about-link"
                            id="link-email"
                        >
                            <VscMail /> {profile.contact.email}
                        </a>
                        <a
                            href={profile.socialLinks.github}
                            target="_blank"
                            rel="noreferrer"
                            className="about-link"
                            id="link-github"
                        >
                            <VscGithubInverted /> GitHub
                        </a>
                        <a
                            href={profile.socialLinks.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="about-link"
                            id="link-linkedin"
                        >
                            <VscLinkExternal /> LinkedIn
                        </a>
                        {profile.socialLinks.x && (
                            <a
                                href={profile.socialLinks.x}
                                target="_blank"
                                rel="noreferrer"
                                className="about-link"
                                id="link-x"
                            >
                                𝕏 Twitter / X
                            </a>
                        )}
                        {profile.socialLinks.instagram && (
                            <a
                                href={profile.socialLinks.instagram}
                                target="_blank"
                                rel="noreferrer"
                                className="about-link"
                                id="link-instagram"
                            >
                                📷 Instagram
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <h2 className="section-heading">Eğitim</h2>
            <div className="about-cards-row">
                {profile.education.map((edu) => (
                    <div className="about-card card-hover" key={edu.id}>
                        <div className="about-card-icon">
                            <img
                                src={inonuLogo}
                                alt="İnönü Üniversitesi"
                                className="about-card-logo"
                                draggable="false"
                            />
                        </div>
                        <div className="about-card-content">
                            <div className="about-card-title">{edu.school}</div>
                            <div className="about-card-subtitle">
                                {edu.degree} — {edu.fieldOfStudy}
                            </div>
                            <div className="about-card-meta">
                                {edu.startDate} – {edu.endDate}
                            </div>
                            <div className="about-card-meta">
                                GPA: {edu.gpa}
                            </div>
                            {edu.activities && (
                                <div className="about-card-meta">
                                    🏢 {edu.activities}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <h2 className="section-heading">Konuşulan Diller</h2>
            <div className="about-cards-row">
                {profile.languages.map((lang) => {
                    const FLAG_MAP = {
                        Türkçe: "🇹🇷",
                        İngilizce: "🇬🇧",
                        İspanyolca: "🇪🇸",
                        Almanca: "🇩🇪",
                        Fransızca: "🇫🇷",
                        Japonca: "🇯🇵",
                        Çince: "🇨🇳",
                        Korece: "🇰🇷",
                        Arapça: "🇸🇦",
                        Rusça: "🇷🇺",
                        İtalyanca: "🇮🇹",
                        Portekizce: "🇵🇹",
                    };
                    const flag = FLAG_MAP[lang.name] || "🌐";
                    return (
                        <div className="about-card card-hover" key={lang.name}>
                            <div className="about-card-icon">{flag}</div>
                            <div className="about-card-content">
                                <div className="about-card-title">
                                    {lang.name}
                                </div>
                                <div className="about-card-subtitle">
                                    {lang.proficiency}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default AboutPanel;
