import { useMemo } from 'react';
import CertificationCard from '../components/certifications/CertificationCard';
import certificationsData from '../data/certifications.json';
import { useTranslation } from '../hooks/translation';

const PAGE_STYLE = {
  width: '100%',
  maxWidth: '72rem',
  margin: '0 auto',
  paddingLeft: '1.5rem',
  paddingRight: '1.5rem',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
  boxSizing: 'border-box',
};

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
    <div style={PAGE_STYLE}>
      {/* Fixed header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem', flexShrink: 0 }}>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">{t('certifications.title')}</h1>
        <p className="text-base text-neutral-400 mt-1">{t('certifications.subtitle')}</p>
      </div>

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
    </div>
  );
}
