import PageLayout from '../../components/layout/PageLayout';
import { usePublishedPosts } from '../../hooks/usePosts';
import { useTranslation } from '../../hooks/translation';
import PostCard from '../../components/blog/PostCard';
import { isFirebaseConfigured } from '../../firebase/config';

export default function BlogListPage() {
  const { t } = useTranslation();
  const { posts, loading, error } = usePublishedPosts();

  return (
    <PageLayout
      title={t('blog.title')}
      subtitle={t('blog.subtitle')}
      maxWidth="52rem"
    >
      {!isFirebaseConfigured() && (
        <p className="text-sm text-amber-400 text-center mb-4">
          {t('blog.firebaseNotConfigured')}
        </p>
      )}
      {loading && <p className="text-neutral-500 text-sm text-center">{t('blog.loading')}</p>}
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
      {!loading && !error && posts.length === 0 && (
        <p className="text-neutral-500 text-sm text-center select-none">{t('blog.noPosts')}</p>
      )}

      <div className="grid grid-cols-1 gap-6">
        {posts.map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </PageLayout>
  );
}
