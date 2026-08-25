import { useMemo } from 'react';
import PageLayout from '../components/layout/PageLayout';
import CertificationCard from '../components/certifications/CertificationCard';
import certificationsData from '../data/certifications.json';
import { useTranslation } from '../hooks/translation';

export default function CertificationsPage() {
  const { t, tData } = useTranslation();

  const grouped = useMemo(() => {
    const map = new Map();
    certificationsData.forEach((cert) => {
      const key = typeof cert.authority === 'object' ? cert.authority.tr : cert.authority;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(cert);
    });
    return Array.from(map.entries());
  }, []);

  return (
    <PageLayout
      title={t('certifications.title')}
      subtitle={t('certifications.subtitle')}
      maxWidth="72rem"
      fullHeight
    >
      {/* Scrollable content area */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {grouped.map(([key, certs]) => (
            <div key={key}>
              <h2
                className="text-base font-bold text-orange-400 mb-4 pb-2 flex items-center gap-2"
                style={{ borderBottom: '1px solid rgba(249,115,22,0.2)' }}
              >
                <span>📜</span>
                <span>{tData(certs[0].authority)}</span>
                <span
                  className="text-xs font-mono text-neutral-500 font-normal px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                >
                  {certs.length}
                </span>
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
    </PageLayout>
  );
}
