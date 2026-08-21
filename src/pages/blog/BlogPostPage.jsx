import { useParams, Link } from 'react-router-dom';
import { usePost } from '../../hooks/usePosts';
import { useApprovedComments } from '../../hooks/useComments';
import { useTranslation } from '../../hooks/translation';
import CommentList from '../../components/blog/CommentList';
import CommentForm from '../../components/blog/CommentForm';
import ImageCarousel from '../../components/blog/ImageCarousel';
import { formatPostDate } from '../../lib/format';

const PAGE_STYLE = {
  maxWidth: '48rem',
  margin: '0 auto',
  paddingLeft: '1.5rem',
  paddingRight: '1.5rem',
  paddingTop: '2.5rem',
  paddingBottom: '4rem',
};

export default function BlogPostPage() {
  const { postId } = useParams();
  const { post, loading } = usePost(postId);
  const { comments } = useApprovedComments(postId);
  const { t, tData, lang } = useTranslation();

  const dateStr = formatPostDate(post?.createdAt, lang);

  return (
    <div style={PAGE_STYLE}>
      <Link
        to="/blog"
        className="inline-block text-sm text-neutral-400 hover:text-orange-400 mb-6 transition-colors"
      >
        ← {t('blog.backToList')}
      </Link>

      {loading && <p className="text-neutral-500 text-sm">{t('blog.loading')}</p>}
      {!loading && !post && (
        <p className="text-neutral-500 text-sm">{t('blog.noPosts')}</p>
      )}

      {post && (
        <article className="flex flex-col gap-6">
          {/* Başlık */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 leading-tight">
            {tData(post.title)}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-3 text-xs font-mono text-neutral-500">
            {dateStr && <span>📅 {dateStr}</span>}
            {post.authorName && (
              <span>{t('blog.by')} <span className="text-orange-400">{post.authorName}</span></span>
            )}
          </div>

          {/* İçerik — önce metin */}
          <div className="text-neutral-200 leading-loose whitespace-pre-wrap text-[15px]">
            {tData(post.body)}
          </div>

          {/* Görseller — metnin altında, carousel */}
          {post.images?.length > 0 && (
            <ImageCarousel images={post.images} height={420} />
          )}

          {/* Yorumlar */}
          <section className="mt-4 pt-8 border-t border-white/10 flex flex-col gap-6">
            <h2 className="text-xl font-bold text-slate-100">
              {t('blog.commentsTitle')} ({comments.length})
            </h2>
            <CommentForm postId={post.id} />
            <CommentList comments={comments} postId={post.id} />
          </section>
        </article>
      )}
    </div>
  );
}
