import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/translation';
import ImageCarousel from './ImageCarousel';
import { TwitterIcon, VerifiedIcon } from '../ui/icons';
import { formatPostDate } from '../../lib/format';

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

export default function PostCard({ post }) {
  const { t, tData, lang } = useTranslation();
  const title     = tData(post.title) || '';
  const rawBody   = tData(post.body)  || '';
  const excerpt   = rawBody.replace(/[#*>`_\n]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);
  const mins      = readingTime(rawBody);
  const hasImages = post.images && post.images.length > 0;
  const avatar    = pickPhoto(post.id);

  const dateStr = formatPostDate(post.createdAt, lang);

  return (
    <Link
      to={`/blog/${post.id}`}
      className="glass-card block overflow-hidden transition-all duration-300"
      style={{ textDecoration: 'none' }}
    >
      <div className="flex flex-col gap-4" style={{ padding: '1.25rem' }}>

        {/* ── Header: Emre imzalı tweet ── */}
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
                <span className="hover:text-neutral-200 transition-colors whitespace-nowrap">
                  @MrTiryaki
                </span>
                {dateStr && (
                  <>
                    <span className="text-neutral-600">·</span>
                    <span className="whitespace-nowrap">{dateStr}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Twitter/X ikonu (dekoratif — kartın tamamı linke gider) */}
          <TwitterIcon className="text-xl text-neutral-500 hover:text-orange-400 transition-colors shrink-0" />
        </div>

        {/* ── Body: başlık + özet ── */}
        <div className="flex flex-col gap-1.5">
          {title && (
            <h3 className="text-lg font-extrabold text-slate-100 leading-snug">
              {title}
            </h3>
          )}
          {excerpt && (
            <p className="text-[15px] text-neutral-400 leading-relaxed">
              {excerpt}{rawBody.length > 200 ? '…' : ''}
            </p>
          )}
        </div>

        {/* ── Görseller — kaydırılabilir carousel ── */}
        {hasImages && <ImageCarousel images={post.images} />}

        {/* ── Footer: okuma süresi + devamı ── */}
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
