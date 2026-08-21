import { useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePost, useApprovedComments } from '../../hooks/useBlog';
import { useTranslation } from '../../hooks/useTranslation';
import CommentList from '../../components/blog/CommentList';
import CommentForm from '../../components/blog/CommentForm';

const PAGE_STYLE = {
  width: '100%',
  maxWidth: '48rem',
  margin: '0 auto',
  paddingLeft: '1.5rem',
  paddingRight: '1.5rem',
  paddingTop: '2.5rem',
  paddingBottom: '4rem',
};

/* ── Yatay snap-scroll carousel ── */
function ImageCarousel({ images }) {
  const trackRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  if (!images || images.length === 0) return null;

  const handleScroll = () => {
    if (!trackRef.current) return;
    const { scrollLeft, clientWidth } = trackRef.current;
    setActiveIdx(Math.round(scrollLeft / (clientWidth * 0.85 + 8)));
  };

  const scrollTo = (i) => {
    if (!trackRef.current) return;
    const itemW = trackRef.current.clientWidth * 0.85 + 8;
    trackRef.current.scrollTo({ left: i * itemW, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl">
      {/* Track */}
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory overflow-x-auto gap-2 no-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="relative shrink-0 snap-center snap-always"
          >
            <img
              src={src}
              alt={`Fotoğraf ${i + 1}`}
              loading="lazy"
              className="rounded-2xl"
              style={{ display: 'block', height: 320, width: 'auto', maxWidth: '85vw' }}
            />
          </div>
        ))}
        {/* Sağda boşluk — son fotoğraf snap'ten sonra solda kalmaz */}
        <div className="shrink-0" style={{ width: '7.5%' }} />
      </div>

      {/* Dot indicator */}
      {images.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-3">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIdx ? 'w-5 bg-orange-400' : 'w-1.5 bg-neutral-600'
              }`}
              aria-label={`Fotoğraf ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BlogPostPage() {
  const { postId } = useParams();
  const { post, loading } = usePost(postId);
  const { comments } = useApprovedComments(postId);
  const { t, tData, lang } = useTranslation();

  const dateStr = post?.createdAt?.toDate?.()
    ? post.createdAt.toDate().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : '';

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
            <ImageCarousel images={post.images} />
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
