import { useParams, Link } from 'react-router-dom';
import { usePost, useApprovedComments } from '../../hooks/useBlog';
import { useTranslation } from '../../hooks/useTranslation';
import ImageGrid from '../../components/blog/ImageGrid';
import CommentList from '../../components/blog/CommentList';
import CommentForm from '../../components/blog/CommentForm';

const PAGE_STYLE = {
  width: '100%', maxWidth: '48rem', margin: '0 auto',
  paddingLeft: '1.5rem', paddingRight: '1.5rem',
  display: 'flex', flexDirection: 'column', height: '100%',
  overflow: 'hidden', boxSizing: 'border-box',
};

export default function BlogPostPage() {
  const { postId } = useParams();
  const { post, loading } = usePost(postId);
  const { comments } = useApprovedComments(postId);
  const { t, tData } = useTranslation();

  return (
    <div style={PAGE_STYLE}>
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0, paddingBottom: '1rem' }}>
        <Link
          to="/blog"
          className="inline-block text-sm text-neutral-400 hover:text-orange-400 mb-4"
        >
          {t('blog.backToList')}
        </Link>

        {loading && <p className="text-neutral-500 text-sm">…</p>}
        {!loading && !post && (
          <p className="text-neutral-500 text-sm">{t('blog.noPosts')}</p>
        )}

        {post && (
          <article>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 leading-tight">
              {tData(post.title)}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-xs font-mono text-neutral-500">
              <span>📅 {post.createdAt?.toDate?.().toLocaleDateString() || ''}</span>
              {post.authorName && (
                <span>{t('blog.by')} <span className="text-orange-400">{post.authorName}</span></span>
              )}
            </div>

            {post.images?.length > 0 && (
              <div className="my-5">
                <ImageGrid images={post.images} />
              </div>
            )}

            <div className="text-neutral-200 leading-relaxed mt-4 whitespace-pre-wrap text-[15px]">
              {tData(post.body)}
            </div>

            {/* Yorumlar */}
            <section className="mt-10 pt-6 border-t border-white/10">
              <h2 className="text-xl font-bold text-slate-100 mb-4">
                {t('blog.commentsTitle')} ({comments.length})
              </h2>

              <div className="mb-8">
                <CommentForm postId={post.id} />
              </div>

              <CommentList comments={comments} postId={post.id} />
            </section>
          </article>
        )}
      </div>
    </div>
  );
}
