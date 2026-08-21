import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';

// Personal fotoğrafları Carousel ile aynı glob'dan çek
const photoModules = import.meta.glob(
  '../../assets/personal_photos/*.{jpg,jpeg,png,JPG,JPEG,PNG}',
  { eager: true, import: 'default' }
);
const photos = Object.entries(photoModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

function pickPhoto(id = '') {
  if (!photos.length) return null;
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return photos[hash % photos.length];
}

function readingTime(text = '') {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/* ── Yatay snap-scroll carousel ── */
function ImageCarousel({ images }) {
  const trackRef = useRef(null);

  // Link tıklamasını engelle — sadece scroll hareketlerinde
  const stopProp = (e) => e.preventDefault();

  return (
    <div
      className="relative w-full"
      /* carousel alanındaki tıklamaların Link'e geçmesini engelle */
      onClick={stopProp}
    >
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory overflow-x-auto gap-2 no-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className="shrink-0 snap-center snap-always"
          >
            <img
              src={src}
              alt={`Fotoğraf ${i + 1}`}
              loading="lazy"
              draggable={false}
              className="rounded-xl"
              style={{ display: 'block', height: 280, width: 'auto', maxWidth: '100%' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PostCard({ post }) {
  const { t, tData, lang } = useTranslation();
  const title     = tData(post.title) || '';
  const rawBody   = tData(post.body)  || '';
  const excerpt   = rawBody.replace(/[#*>`_\n]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180);
  const mins      = readingTime(rawBody);
  const hasImages = post.images && post.images.length > 0;
  const avatar    = pickPhoto(post.id);

  const dateStr = post.createdAt?.toDate?.()
    ? post.createdAt.toDate().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : '';

  return (
    <Link
      to={`/blog/${post.id}`}
      className="glass-card block overflow-hidden transition-all duration-300"
      style={{ textDecoration: 'none' }}
    >
      <div className="p-6 flex flex-col gap-5">

        {/* Yazar satırı */}
        <div className="flex items-center gap-3">
          {avatar && (
            <img
              src={avatar}
              alt="Emre Tiryaki"
              className="size-11 rounded-full object-cover object-top border border-white/10 shrink-0"
            />
          )}
          <div className="flex flex-col leading-tight gap-0.5">
            <span className="text-sm font-semibold text-slate-100">Emre Tiryaki</span>
            {dateStr && (
              <span className="text-xs font-mono text-neutral-500">{dateStr}</span>
            )}
          </div>
        </div>

        {/* Başlık */}
        <h3 className="text-xl font-extrabold text-slate-100 leading-snug">
          {title}
        </h3>

        {/* Özet */}
        {excerpt && (
          <p className="text-sm text-neutral-400 leading-relaxed line-clamp-3">
            {excerpt}{rawBody.length > 180 ? '…' : ''}
          </p>
        )}

        {/* Görseller — kaydırılabilir carousel */}
        {hasImages && <ImageCarousel images={post.images} />}

        {/* Alt bar */}
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <span className="text-xs font-mono text-neutral-500">
            {mins} {lang === 'tr' ? 'dk okuma' : 'min read'}
          </span>
          <span className="text-xs font-semibold text-orange-400">
            {t('blog.readMore')} →
          </span>
        </div>
      </div>
    </Link>
  );
}
