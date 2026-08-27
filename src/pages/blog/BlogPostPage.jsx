import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { usePost } from '../../hooks/usePosts';
import { useApprovedComments } from '../../hooks/useComments';
import { useTranslation } from '../../hooks/translation';
import CommentList from '../../components/blog/CommentList';
import CommentForm from '../../components/blog/CommentForm';
import ImageCarousel from '../../components/blog/ImageCarousel';
import { VerifiedIcon } from '../../components/ui/icons';
import { formatPostDate } from '../../lib/format';
import { pickPhoto } from '../../lib/blog/avatar';
import Button from '../../components/ui/Button';

// Sabit genişlikli sütun — görsel var/yok fark etmeksizin genişlik değişmez.
const SHELL_STYLE = {
  width: '100%',
  maxWidth: '56rem',
  margin: '0 auto',
};

function readingTime(text = '') {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function BlogPostPage() {
  const { postId } = useParams();
  const { post, loading } = usePost(postId);
  const { comments } = useApprovedComments(postId);
  const { t, tData, lang } = useTranslation();

  const avatar = post ? pickPhoto(post.id) : null;
  const dateStr = formatPostDate(post?.createdAt, lang);
  const mins = readingTime(tData(post?.body) || '');
  const [showForm, setShowForm] = useState(false);

  return (
    <div style={SHELL_STYLE}>
      <div style={{ padding: '2.5rem 1.5rem 4rem' }}>
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
          <article className="glass-card rounded-2xl overflow-hidden">
            <div
              className="flex flex-col"
              style={{ padding: '1.5rem', gap: '1.25rem' }}
            >

              {/* ── Header: Emre imzalı tweet (PostCard ile aynı) ── */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {avatar && (
                    <img
                      src={avatar}
                      alt="Emre Tiryaki"
                      width={48}
                      height={48}
                      className="size-12 rounded-full object-cover object-top border border-white/10 shrink-0"
                    />
                  )}
                  <div className="flex flex-col leading-tight gap-0.5">
                    <div className="flex items-center gap-1">
                      <span className="text-[15px] font-semibold text-slate-100 whitespace-nowrap">
                        Emre Tiryaki
                      </span>
                      <VerifiedIcon className="size-[1.05em] text-sky-500" />
                    </div>
                    <div className="flex items-center gap-1 text-sm text-neutral-400">
                      {dateStr && (
                        <span className="whitespace-nowrap">{dateStr}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Başlık: tweet başlığı gibi büyük ── */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 leading-tight">
                {tData(post.title)}
              </h1>

              {/* ── Gövde: okunabilir metin ── */}
              <div className="text-neutral-200 leading-loose whitespace-pre-wrap text-[15px] sm:text-base">
                {tData(post.body)}
              </div>

              {/* ── Görseller — sabit yükseklik carousel ── */}
              {post.images?.length > 0 && (
                <ImageCarousel images={post.images} height={420} />
              )}

              {/* ── Footer: okuma süresi + tarih ── */}
              <div
                className="flex items-center justify-between border-t border-white/[0.06]"
                style={{ paddingTop: '1rem' }}
              >
                <span className="text-xs font-mono text-neutral-500">
                  {t('blog.readTime', { n: mins })}
                </span>
                {dateStr && (
                  <span className="text-xs text-neutral-500">{dateStr}</span>
                )}
              </div>
            </div>

            {/* ── Yorumlar ── */}
            <section
              className="flex flex-col border-t border-white/10"
              style={{ padding: '2rem 1.5rem', gap: '1.5rem' }}
            >
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-100">
                  {t('blog.commentsTitle')} ({comments.length})
                </h2>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowForm((v) => !v)}
                >
                  {showForm ? '✕' : `✎ ${t('blog.writeComment')}`}
                </Button>
              </div>

              {showForm && (
                <CommentForm
                  postId={post.id}
                  autoFocus
                  onDone={() => setShowForm(false)}
                />
              )}

              <CommentList comments={comments} postId={post.id} />
            </section>
          </article>
        )}
      </div>
    </div>
  );
}
