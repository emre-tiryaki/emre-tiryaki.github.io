import { useMemo } from 'react';
import CertificationCard from '../components/certifications/CertificationCard';
import certificationsData from '../data/certifications.json';
import { useTranslation } from '../hooks/useTranslation';

export default function CertificationsPage() {
  const { t, tData } = useTranslation();

  // Group certifications by authority name
  const grouped = useMemo(() => {
    const map = new Map();
    certificationsData.forEach((cert) => {
      const authorityName = typeof cert.authority === 'object' ? cert.authority.tr : cert.authority;
      if (!map.has(authorityName)) {
        map.set(authorityName, []);
      }
      map.get(authorityName).push(cert);
    });
    return Array.from(map.entries());
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center sm:text-left space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-100">{t('certifications.title')}</h1>
        <p className="text-sm sm:text-base text-neutral-400">{t('certifications.subtitle')}</p>
      </div>

      {/* Grouped Certifications */}
      <div className="space-y-8">
        {grouped.map(([authorityName, certs]) => (
          <div key={authorityName} className="space-y-4">
            <h2 className="text-lg font-bold text-orange-400 border-b border-neutral-800 pb-2 flex items-center gap-2">
              <span>📜</span>
              <span>{tData(certs[0].authority)}</span>
              <span className="text-xs font-mono text-neutral-500 font-normal">({certs.length})</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certs.map((cert) => (
                <CertificationCard key={cert.id} {...cert} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
