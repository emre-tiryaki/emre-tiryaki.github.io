import { useState, useEffect } from 'react';
import { FiGitCommit, FiAlertCircle, FiExternalLink } from 'react-icons/fi';
import { useTranslation } from '../../hooks/useTranslation';

const GITHUB_USERNAME = 'emre-tiryaki';
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

function timeAgo(dateStr, lang) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (lang === 'tr') {
    if (diffMins < 60) return `${diffMins} dk önce`;
    if (diffHours < 24) return `${diffHours} sa önce`;
    if (diffDays === 1) return 'dün';
    if (diffDays < 30) return `${diffDays} gün önce`;
    return date.toLocaleDateString('tr-TR');
  } else {
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US');
  }
}

export default function GitHubActivity() {
  const { t, lang } = useTranslation();
  const [commits, setCommits] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    const headers = { Accept: 'application/vnd.github+json' };
    if (TOKEN) headers['Authorization'] = `Bearer ${TOKEN}`;

    fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`,
      { headers }
    )
      .then((res) => {
        if (!res.ok) {
          if (res.status === 403) throw new Error(lang === 'tr' ? 'Rate limit aşıldı • Biraz sonra tekrar dene' : 'Rate limit exceeded • Try again later');
          if (res.status === 404) throw new Error(lang === 'tr' ? 'Kullanıcı bulunamadı' : 'User not found');
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((events) => {
        if (cancelled) return;
        const pushEvents = events.filter((e) => e.type === 'PushEvent');
        const items = [];
        pushEvents.forEach((event) => {
          event.payload.commits?.forEach((c) => {
            items.push({
              id: c.sha,
              repo: event.repo.name.replace(`${GITHUB_USERNAME}/`, ''),
              message: c.message.split('\n')[0].slice(0, 90),
              date: event.created_at,
              url: `https://github.com/${event.repo.name}/commit/${c.sha}`,
            });
          });
        });
        if (items.length === 0) {
          setStatus('empty');
        } else {
          setCommits(items.slice(0, 12));
          setStatus('ok');
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setErrorMsg(err.message || '');
          setStatus('error');
        }
      });

    return () => { cancelled = true; };
  }, [lang]);

  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-white/10">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2.5">
          <FiGitCommit className="text-orange-400" size={22} />
          <span>{t('about.githubActivity')}</span>
        </h2>
        <a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-mono text-neutral-400 hover:text-orange-400 flex items-center gap-1.5 transition-colors"
        >
          <span>@{GITHUB_USERNAME}</span>
          <FiExternalLink size={12} />
        </a>
      </div>

      {status === 'loading' && (
        <div className="space-y-3 pt-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-14 rounded-xl w-full" />
          ))}
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-start gap-3 p-4 rounded-2xl border border-red-500/30 bg-red-950/20 text-sm">
          <FiAlertCircle className="text-red-400 mt-0.5 shrink-0" size={18} />
          <div>
            <p className="text-red-300 font-semibold">{t('about.githubError')}</p>
            {errorMsg && <p className="text-red-400/80 mt-1 text-xs font-mono">{errorMsg}</p>}
          </div>
        </div>
      )}

      {status === 'empty' && (
        <p className="text-neutral-500 text-sm text-center py-6">{t('about.githubEmpty')}</p>
      )}

      {status === 'ok' && (
        <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
          {commits.map((c) => (
            <a
              key={c.id}
              href={c.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-xl bg-neutral-900/60 border border-neutral-800/80 hover:border-orange-500/40 hover:bg-neutral-800/60 transition-all duration-200 group"
            >
              <span className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0 group-hover:scale-110 transition-transform">
                <FiGitCommit size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-semibold text-orange-400/90">{c.repo}</span>
                </div>
                <p className="text-sm font-medium text-neutral-200 group-hover:text-white transition-colors truncate">
                  {c.message}
                </p>
              </div>
              <span className="text-xs font-mono text-neutral-500 shrink-0 pl-2">
                {timeAgo(c.date, lang)}
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
