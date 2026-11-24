import { useEffect, useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import LoginForm from '../components/admin/LoginForm';
import Dashboard from '../components/admin/Dashboard';
import { useTranslation } from '../hooks/translation';
import { THEME_COLORS } from '../theme';
import { isAdminAvailable, onAuthChange } from '../lib/admin';

const { text } = THEME_COLORS;

export default function AdminPage() {
  const { t } = useTranslation();
  const [user, setUser] = useState(undefined); // undefined: oturum durumu henüz bilinmiyor

  useEffect(() => {
    const meta = document.createElement('meta');
    meta.name = 'robots';
    meta.content = 'noindex, nofollow';
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  useEffect(() => (isAdminAvailable ? onAuthChange(setUser) : undefined), []);

  return (
    <PageLayout title={t('admin.title')} subtitle={t('admin.subtitle')}>
      {!isAdminAvailable ? (
        <p role="status" style={{ textAlign: 'center', color: text.muted }}>{t('admin.unavailable')}</p>
      ) : user === undefined ? (
        <p role="status" style={{ textAlign: 'center', color: text.muted }}>{t('admin.loading')}</p>
      ) : user ? (
        <Dashboard />
      ) : (
        <LoginForm />
      )}
    </PageLayout>
  );
}
