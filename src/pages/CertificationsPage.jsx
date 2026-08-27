import { useMemo } from 'react';
import { FiAward } from 'react-icons/fi';
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

  const { multiGroups, compactGroups } = useMemo(() => {
    const multi = [];
    const compact = [];
    grouped.forEach(([key, certs]) => {
      if (certs.length <= 2) {
        compact.push([key, certs]);
      } else {
        multi.push([key, certs]);
      }
    });
    return { multiGroups: multi, compactGroups: compact };
  }, [grouped]);

  return (
    <PageLayout
      title={t('certifications.title')}
      subtitle={t('certifications.subtitle')}
      maxWidth="76rem"
      fullHeight
    >
      {/* Scrollable content area */}
      <div
        className="scroll-mask-y"
        style={{
          flex: 1,
          overflowY: 'auto',
          minHeight: 0,
          paddingTop: '0.75rem',
          paddingBottom: '2.5rem',
          paddingRight: '0.35rem',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Side-by-Side Compact Groups (e.g. İnönü Üniversitesi & TUA) */}
          {compactGroups.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {compactGroups.map(([key, certs]) => (
                <div key={key} className="flex flex-col">
                  <div
                    className="flex items-center justify-between gap-3 px-5 py-2.5 rounded-xl select-none"
                    style={{
                      background: 'linear-gradient(90deg, rgba(249, 115, 22, 0.08) 0%, rgba(255, 255, 255, 0.025) 80%, transparent 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                      marginBottom: '1rem',
                    }}
                  >
                    <h2
                      className="text-xs font-extrabold uppercase tracking-wider text-slate-100 m-0"
                      style={{ paddingLeft: '0.5rem' }}
                    >
                      {tData(certs[0].authority)}
                    </h2>

                    <span
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: '0.5rem',
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        background: 'rgba(249, 115, 22, 0.12)',
                        border: '1px solid rgba(249, 115, 22, 0.35)',
                        color: '#fb923c',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {certs.length} Sertifika
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 flex-1">
                    {certs.map((cert) => (
                      <CertificationCard key={cert.id} {...cert} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Multi-item Groups (e.g. Anthropic) */}
          {multiGroups.map(([key, certs]) => (
            <div key={key}>
              <div
                className="flex items-center justify-between gap-3 px-5 py-2.5 rounded-xl select-none"
                style={{
                  background: 'linear-gradient(90deg, rgba(249, 115, 22, 0.1) 0%, rgba(255, 255, 255, 0.03) 70%, transparent 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  boxShadow: '0 4px 18px rgba(0, 0, 0, 0.35)',
                  marginBottom: '1rem',
                }}
              >
                <h2
                  className="text-xs font-extrabold uppercase tracking-wider text-slate-100 m-0"
                  style={{ paddingLeft: '0.5rem' }}
                >
                  {tData(certs[0].authority)}
                </h2>

                <span
                  style={{
                    padding: '0.25rem 0.65rem',
                    borderRadius: '0.5rem',
                    fontFamily: 'monospace',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    background: 'rgba(249, 115, 22, 0.12)',
                    border: '1px solid rgba(249, 115, 22, 0.35)',
                    color: '#fb923c',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {certs.length} Sertifika
                </span>
              </div>

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
