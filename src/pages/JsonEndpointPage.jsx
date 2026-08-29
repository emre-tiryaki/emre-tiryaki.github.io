import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import projectsData from '../data/projects.json';
import experienceData from '../data/experience.json';
import educationData from '../data/education.json';
import certificationsData from '../data/certifications.json';
import skillsData from '../data/skills.json';
import siteConfig from '../data/siteConfig.json';

// Tüm portfolyo verisini tek nesnede topla (kaynak tek nokta).
const PORTFOLIO_DATA = {
  projects: projectsData,
  experience: experienceData,
  education: educationData,
  certifications: certificationsData,
  skills: skillsData,
  siteConfig,
};

/**
 * /json uç noktası.
 *
 * Bu bir "sayfa" değil, bir endpoint'tir: erişildiğinde HTML render etmez,
 * gövdesi ham JSON olan bir yanıtı tarayıcıya stream eder. Diske .json
 * dosyası yazılmaz — yanıtın kendisi JSON'dur (Content-Type: application/json).
 *
 * Güvenlik: ?token= ile korunur. Token siteConfig.json içinde tutulur ve
 * yalnızca okuma (read-only) amaçlıdır; bu uç nokta veri değiştirmez.
 */
export default function JsonEndpointPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');

  useEffect(() => {
    if (token !== siteConfig.jsonEndpointToken) {
      // Yetkisiz: anında 403 JSON yanıtı, sayfayı terk et.
      const body = JSON.stringify(
        { error: 'unauthorized', message: 'geçersiz veya eksik token' },
        null,
        2
      );
      const blob = new Blob([body], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      // 403 durumunu taklit eden bir belge göster.
      document.open();
      document.write(
        `<!doctype html><meta charset="utf-8"><title>403</title><pre>${body}</pre>`
      );
      document.close();
      URL.revokeObjectURL(url);
      return;
    }

    const payload = JSON.stringify(PORTFOLIO_DATA, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.json'; // yine de indirmek istersen
    // Doğrudan gövdeyi JSON olarak göster.
    document.open();
    document.write(
      `<!doctype html><meta charset="utf-8"><title>portfolio.json</title><pre>${payload}</pre>`
    );
    document.close();
    URL.revokeObjectURL(url);
  }, [token, navigate]);

  return null;
}
