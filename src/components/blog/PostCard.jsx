import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import ImageGrid from './ImageGrid';

export default function PostCard({ post }) {
  const { t, tData } = useTranslation();
  const title = tData(post.title);
  const body = tData(post.body) || '';
  const excerpt = body.replace(/[#*>\n]/g, '').slice(0, 160);

  return (
    <Link
      to={`/blog/${post.id}`}
      className="glass-card block rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/40 transition-all duration-300"
      style={{ textDecoration: 'none' }}
    >
      {post.images && post.images.length > 0 && (
        <div className="p-3 pb-0">
          <ImageGrid images={post.images} rounded="0.75rem" />
        </div>
      )}
      <div className="p-5">
        <h3 className="text-xl font-extrabold text-slate-100 leading-tight">
          {title}
        </h3>
        {excerpt && (
          <p className="text-sm text-neutral-400 mt-2 leading-relaxed line-clamp-3">
            {excerpt}…
          </p>
        )}
        <div className="flex items-center gap-2 mt-3 text-xs font-mono text-neutral-500">
          <span>📅 {post.createdAt?.toDate?.().toLocaleDateString() || ''}</span>
          <span className="text-orange-400 ml-auto font-semibold">
            {t('blog.readMore')} →
          </span>
        </div>
      </div>
    </Link>
  );
}
