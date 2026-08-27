import { useAuth } from '../../hooks/auth';
import { useTranslation } from '../../hooks/translation';
import AdminLogin from '../../components/admin/AdminLogin';
import AdminPanel from '../../components/admin/AdminPanel';
import { isFirebaseConfigured } from '../../firebase/config';

const PAGE_STYLE = {
  width: '100%', maxWidth: '56rem', margin: '0 auto',
  paddingLeft: '1.5rem', paddingRight: '1.5rem',
  display: 'flex', flexDirection: 'column', height: '100%',
  overflow: 'hidden', boxSizing: 'border-box',
};

export default function AdminPage() {
  const { user, loading } = useAuth();
  const { t } = useTranslation();

  if (!isFirebaseConfigured()) {
    return (
      <div style={PAGE_STYLE} className="flex items-center justify-center">
        <p className="text-amber-400 text-sm text-center max-w-md">
          {t('blog.firebaseNotConfigured')}
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={PAGE_STYLE} className="flex items-center justify-center">
        <p className="text-neutral-500 text-sm">…</p>
      </div>
    );
  }

  return user ? <AdminPanel /> : <AdminLogin />;
}
