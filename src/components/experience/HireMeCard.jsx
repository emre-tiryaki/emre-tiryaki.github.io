import { useState, useEffect } from 'react';
import siteConfig from '../../data/siteConfig.json';
import experienceData from '../../data/experience.json';
import { useTranslation } from '../../hooks/useTranslation';

const ctaImageModules = import.meta.glob(
  '../../assets/experience/*.{jpg,jpeg,png,webp}',
  { eager: true, import: 'default' }
);
const CTA_IMAGES = Object.values(ctaImageModules);

export default function HireMeCard() {
  const { t, tData } = useTranslation();
  const [variant, setVariant] = useState(null);

  // Check if there is any active ongoing experience
  const hasActiveExperience = experienceData.some((item) => {
    const endStr = (tData(item.endDate) || '').toLowerCase();
    return endStr.includes('devam') || endStr.includes('present');
  });

  useEffect(() => {
    if (!siteConfig.showHireMeCard || hasActiveExperience) return;

    const img = CTA_IMAGES[Math.floor(Math.random() * CTA_IMAGES.length)];
    const titleKey = ['hireMeTitle', 'hireMeTitle2', 'hireMeTitle3'][
      Math.floor(Math.random() * 3)
    ];
    const subKey = ['hireMeSub', 'hireMeSub2', 'hireMeSub3', 'hireMeSub4'][
      Math.floor(Math.random() * 4)
    ];

    setVariant({ img, titleKey, subKey });
  }, [hasActiveExperience]);

  if (!siteConfig.showHireMeCard || hasActiveExperience || !variant) {
    return null;
  }

  return (
    <a
      href={`mailto:${t('about.email')}`}
      className="group mb-8 block overflow-hidden rounded-2xl border border-orange-500/40 bg-gradient-to-r from-orange-950/40 via-neutral-900/80 to-neutral-900/90 p-6 transition-all duration-300 hover:border-orange-500 hover:shadow-2xl hover:shadow-orange-500/20"
    >
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {variant.img && (
          <img
            src={variant.img}
            alt=""
            className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border border-orange-500/30 group-hover:scale-105 transition-transform duration-300 shrink-0"
          />
        )}
        <div className="flex-1 text-center sm:text-left space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 group-hover:text-orange-400 transition-colors">
            {t(`experience.${variant.titleKey}`)}
          </h2>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-400 group-hover:translate-x-1 transition-transform">
            {t(`experience.${variant.subKey}`)} →
          </span>
        </div>
      </div>
    </a>
  );
}
