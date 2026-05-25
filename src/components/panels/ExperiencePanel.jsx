import { useState, useEffect } from "react";
import experience from "../../data/experience.json";

const TYPE_CONFIG = {
    internship: { label: "Staj", color: "var(--accent)" },
    hackathon: { label: "Hackathon", color: "var(--accent-peach)" },
    competition: { label: "Yarışma", color: "var(--accent-yellow)" },
};

/* ── CTA resimlerini klasörden otomatik yükle ── */
const ctaImageModules = import.meta.glob(
    "../../assets/experience/*.{jpg,jpeg,png,webp}",
    { eager: true, import: "default" },
);
const CTA_IMAGES = Object.values(ctaImageModules);

/**
 * Başlık dizisi — buraya yeni string eklemek yeterli.
 * Sayfa her yüklendiğinde rastgele biri seçilir.
 */
const CTA_TITLES = [
    "Sıradaki deneyimim siz olabilirsiniz",
    "Bu alanda sizde bulunabilirsiniz",
    "Yazılımcı mı lazım?",
    "Beni işe mi almak istiyorsunuz?",
];

const CTA_SUBTITLES = [
    "Bana ulaşın",
    "Beni işe alın",
    "İletişime geçin",
    "Konuşalım",
];

function TimelineCTA() {
    const [variant, setVariant] = useState(null);

    useEffect(() => {
        const image = CTA_IMAGES[Math.floor(Math.random() * CTA_IMAGES.length)];
        const title = CTA_TITLES[Math.floor(Math.random() * CTA_TITLES.length)];
        const subtitle =
            CTA_SUBTITLES[Math.floor(Math.random() * CTA_SUBTITLES.length)];
        setVariant({ image, title, subtitle });
    }, []);

    if (!variant) return null;

    return (
        <a
            className="exp-cta-hero"
            href="mailto:tiryakiemre18@gmail.com"
            title="Mail gönder"
        >
            <img src={variant.image} alt="" className="exp-cta-img" />
            <div className="exp-cta-text">
                <div className="exp-cta-title">{variant.title}</div>
                <div className="exp-cta-sub">{variant.subtitle} →</div>
            </div>
        </a>
    );
}

const MONTHS = {
    ocak: 0,
    subat: 1,
    şubat: 1,
    mart: 2,
    nisan: 3,
    mayis: 4,
    mayıs: 4,
    haziran: 5,
    temmuz: 6,
    agustos: 7,
    ağustos: 7,
    eylul: 8,
    eylül: 8,
    ekim: 9,
    kasim: 10,
    kasım: 10,
    aralik: 11,
    aralık: 11,
};

function normalizeText(value) {
    return value
        .toLocaleLowerCase("tr-TR")
        .normalize("NFD")
        .replace(/\p{Diacritic}/gu, "");
}

function getExperienceSortValue(item) {
    const rawValue = item.startDate || item.date || "";
    const normalizedValue = normalizeText(rawValue);
    const [monthText, yearText] = normalizedValue.split(/\s+/);
    const monthIndex = MONTHS[monthText];
    const year = Number.parseInt(yearText, 10);

    if (Number.isFinite(year) && monthIndex !== undefined) {
        return year * 12 + monthIndex;
    }

    if (Number.isFinite(year)) {
        return year * 12;
    }

    return Number.NEGATIVE_INFINITY;
}
function ExperiencePanel() {
    const sorted = [...experience].sort((a, b) => {
        return getExperienceSortValue(b) - getExperienceSortValue(a);
    });

    return (
        <div id="panel-experience">
            <h1 className="panel-title">Deneyim</h1>
            <p className="panel-subtitle">
                Profesyonel stajlar ve teknik etkinlikler
            </p>

            <TimelineCTA />

            <div className="exp-timeline">
                {sorted.map((item, idx) => {
                    const config =
                        TYPE_CONFIG[item.type] || TYPE_CONFIG.internship;
                    const dateText = item.startDate
                        ? `${item.startDate} – ${item.endDate}`
                        : item.date +
                          (item.duration ? ` (${item.duration})` : "");
                    const side = idx % 2 === 0 ? "left" : "right";

                    return (
                        <div
                            className={`exp-timeline-item exp-timeline-item--${side}`}
                            key={item.id}
                            style={{ "--exp-accent": config.color }}
                        >
                            <div className="exp-timeline-dot" />
                            <div className="exp-tl-card">
                                <div className="exp-tl-header">
                                    <h3 className="exp-tl-company">
                                        {item.company}
                                    </h3>
                                    <span className="exp-tl-type">
                                        {config.label}
                                    </span>
                                </div>
                                <div className="exp-tl-role">{item.title}</div>
                                <div className="exp-tl-meta">
                                    <span>📅 {dateText}</span>
                                    {item.location && (
                                        <span>📍 {item.location}</span>
                                    )}
                                </div>
                                {item.achievement && (
                                    <div className="exp-tl-achievement">
                                        🏆 {item.achievement}
                                    </div>
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
