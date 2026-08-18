import { usePublishedPosts } from '../../hooks/useBlog';
import { useTranslation } from '../../hooks/useTranslation';
import PostCard from '../../components/blog/PostCard';
import { isFirebaseConfigured } from '../../firebase/config';

const PAGE_STYLE = {
  width: '100%', maxWidth: '52rem', margin: '0 auto',
  paddingLeft: '1.5rem', paddingRight: '1.5rem',
  display: 'flex', flexDirection: 'column', height: '100%',
  overflow: 'hidden', boxSizing: 'border-box',
};

export default function BlogListPage() {
  const { t } = useTranslation();
  const { posts, loading, error } = usePublishedPosts();

  return (
    <div style={PAGE_STYLE}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem', flexShrink: 0 }}>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">{t('blog.title')}</h1>
        <p className="text-base text-neutral-400 mt-1">{t('blog.subtitle')}</p>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, paddingBottom: '1rem' }}>
        {!isFirebaseConfigured() && (
          <p className="text-sm text-amber-400 text-center">
            ⚠ Firebase yapılandırılmamış — src/firebase/config.js dosyasını doldurun.
          </p>
        )}
        {loading && <p className="text-neutral-500 text-sm text-center">{t('blog.loading')}</p>}
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        {!loading && !error && posts.length === 0 && (
          <p className="text-neutral-500 text-sm text-center">{t('blog.noPosts')}</p>
        )}
        <div className="grid grid-cols-1 gap-5">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
