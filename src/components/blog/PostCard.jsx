import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/translation';
import ImageCarousel from './ImageCarousel';
import { VerifiedIcon } from '../ui/icons';
import { formatPostDate } from '../../lib/format';
import { pickPhoto } from '../../lib/blog/avatar';

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
      <div
        className="flex flex-col"
        style={{ padding: '1.25rem', gap: '1rem' }}
      >

        {/* ── Header: Emre imzalı tweet ── */}
        <div className="flex items-start justify-between">
          <div className="flex items-center" style={{ gap: '0.75rem' }}>
            {avatar && (
              <img
                src={avatar}
                alt="Emre Tiryaki"
                width={48}
                height={48}
                className="size-12 rounded-full object-cover object-top border border-white/10 shrink-0"
              />
            )}
            <div className="flex flex-col leading-tight" style={{ gap: '0.125rem' }}>
              <div className="flex items-center" style={{ gap: '0.25rem' }}>
                <span className="text-[15px] font-semibold text-slate-100 whitespace-nowrap">
                  Emre Tiryaki
                </span>
                <VerifiedIcon className="size-[1.05em] text-sky-500" />
              </div>
              <div className="flex items-center text-sm text-neutral-400" style={{ gap: '0.25rem' }}>
                {dateStr && (
                  <span className="whitespace-nowrap">{dateStr}</span>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* ── Body: başlık + özet ── */}
        <div className="flex flex-col" style={{ gap: '0.375rem' }}>
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
        <div
          className="flex items-center justify-between border-t border-white/[0.06]"
          style={{ paddingTop: '0.75rem' }}
        >
          <span className="text-xs text-neutral-500">
            {t('blog.readTime', { n: mins })}
          </span>
          <span className="text-xs font-semibold text-orange-400">
            {t('blog.readMore')} →
          </span>
        </div>
      </div>
    </Link>
  );
}
