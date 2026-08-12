import { useState, useMemo } from 'react';
import HireMeCard from '../components/experience/HireMeCard';
import ExperienceFilter from '../components/experience/ExperienceFilter';
import ExperienceCardFactory from '../components/experience/ExperienceCardFactory';
import experienceData from '../data/experience.json';
import { useTranslation } from '../hooks/useTranslation';

const MONTHS = {
  ocak: 0, subat: 1, şubat: 1, mart: 2, nisan: 3, mayis: 4, mayıs: 4,
  haziran: 5, temmuz: 6, agustos: 7, ağustos: 7, eylul: 8, eylül: 8,
  ekim: 9, kasim: 10, kasım: 10, aralik: 11, aralık: 11,
  january: 0, february: 1, march: 2, april: 3, may: 4, june: 5,
  july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
};

function normalizeText(val) {
  if (!val) return '';
  return String(val)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}

function getSortValue(item) {
  const dateObj = typeof item.startDate === 'object' ? item.startDate.tr : item.startDate || item.date?.tr || item.date || '';
  const normalized = normalizeText(dateObj);
  const parts = normalized.split(/\s+/);
  
  let year = null;
  let month = 0;

  for (const part of parts) {
    const num = parseInt(part, 10);
    if (num > 1900 && num < 2100) year = num;
    if (MONTHS[part] !== undefined) month = MONTHS[part];
  }

  if (year !== null) return year * 12 + month;
  return Number.NEGATIVE_INFINITY;
}

export default function ExperiencePage() {
  const { t } = useTranslation();
  const [activeType, setActiveType] = useState('all');

  // Dynamically extract unique experience types from dataset
  const availableTypes = useMemo(() => {
    const typesSet = new Set(experienceData.map((e) => e.type));
    return ['all', ...Array.from(typesSet)];
  }, []);

  // Sort newest first
  const sortedExperiences = useMemo(() => {
    return [...experienceData].sort((a, b) => getSortValue(b) - getSortValue(a));
  }, []);

  // Filter based on selected type
  const filteredExperiences = useMemo(() => {
    if (activeType === 'all') return sortedExperiences;
    return sortedExperiences.filter((item) => item.type === activeType);
  }, [activeType, sortedExperiences]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center sm:text-left space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-100">{t('experience.title')}</h1>
        <p className="text-sm sm:text-base text-neutral-400">{t('experience.subtitle')}</p>
      </div>

      {/* Conditionally rendered Hire Me CTA Card */}
      <HireMeCard />

      {/* Dynamically Generated Filter Buttons */}
      <ExperienceFilter
        types={availableTypes}
        activeType={activeType}
        onSelect={setActiveType}
      />

      {/* Experience Cards List */}
      <div className="space-y-4">
        {filteredExperiences.map((item) => (
          <ExperienceCardFactory key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
