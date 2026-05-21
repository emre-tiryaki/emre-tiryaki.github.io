import { useMemo } from 'react';
import profile from '../../data/profile.json';
import { VscVerified, VscLinkExternal } from 'react-icons/vsc';
import anthropicLogo from '../../assets/certification_icons/antrophic_certification_logo.jpeg';

const AUTHORITY_ICONS = {
  'Anthropic': anthropicLogo,
};

function CertificationsPanel() {
  const grouped = useMemo(() => {
    const groups = {};
    profile.certifications.forEach(cert => {
      const key = cert.authority;
      if (!groups[key]) groups[key] = [];
      groups[key].push(cert);
    });
    return Object.entries(groups);
  }, []);

  return (
    <div id="panel-certifications">
      <h1 className="panel-title">Sertifikalar</h1>
      <p className="panel-subtitle">Profesyonel gelişim ve doğrulanmış yetkinlikler</p>

      {grouped.map(([authority, certs]) => {
        const authorityIcon = AUTHORITY_ICONS[authority];

        return (
          <div key={authority}>
            <h2 className="section-heading">{authority}</h2>
            <div className="certs-grid">
              {certs.map(cert => {
                const Tag = cert.url ? 'a' : 'div';
                const extraProps = cert.url
                  ? { href: cert.url, target: '_blank', rel: 'noreferrer' }
                  : {};

                return (
                  <Tag className="cert-card card-hover" key={cert.id} id={`cert-${cert.id}`} {...extraProps}>
                    <div className="cert-icon">
                      {authorityIcon ? (
                        <img src={authorityIcon} alt={authority} className="cert-icon-img" />
                      ) : (
                        <VscVerified />
                      )}
                    </div>
                    <div className="cert-info">
                      <div className="cert-name">{cert.name}</div>
                      <div className="cert-meta">
                        {cert.date}
                        {cert.url && <> · <VscLinkExternal style={{ verticalAlign: 'middle', fontSize: 10 }} /> Doğrula</>}
                      </div>
                    </div>
                  </Tag>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CertificationsPanel;
