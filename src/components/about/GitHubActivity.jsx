import { useState, useEffect } from 'react';
import { FiGitCommit, FiAlertCircle } from 'react-icons/fi';
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
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
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
  const [status, setStatus] = useState('loading'); // 'loading' | 'ok' | 'error' | 'empty'
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
              message: c.message.split('\n')[0].slice(0, 80),
              date: event.created_at,
            });
          });
        });
        if (items.length === 0) {
          setStatus('empty');
        } else {
          setCommits(items.slice(0, 15));
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
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-neutral-200 mb-3 flex items-center gap-2">
        <FiGitCommit className="text-orange-400" size={18} />
        {t('about.githubActivity')}
      </h2>

      {status === 'loading' && (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-12 rounded-lg w-full" />
          ))}
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-start gap-3 p-4 rounded-xl border border-red-900/40 bg-red-950/20 text-sm">
          <FiAlertCircle className="text-red-400 mt-0.5 shrink-0" size={16} />
          <div>
            <p className="text-red-300">{t('about.githubError')}</p>
            {errorMsg && <p className="text-red-500 mt-1 text-xs">{errorMsg}</p>}
          </div>
        </div>
      )}

      {status === 'empty' && (
        <p className="text-neutral-500 text-sm">{t('about.githubEmpty')}</p>
      )}

      {status === 'ok' && (
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {commits.map((c) => (
            <div
              key={c.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-neutral-900/60 border border-neutral-800 hover:border-neutral-600 transition-colors"
            >
              <FiGitCommit className="text-orange-400/70 mt-0.5 shrink-0" size={14} />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-orange-400/80 font-mono mb-0.5">{c.repo}</p>
                <p className="text-sm text-neutral-300 truncate">{c.message}</p>
              </div>
              <span className="text-xs text-neutral-600 shrink-0 whitespace-nowrap">{timeAgo(c.date, lang)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
