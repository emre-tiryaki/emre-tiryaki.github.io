import { useState, useEffect } from 'react';
import { FiGitCommit, FiAlertCircle, FiExternalLink, FiGitPullRequest, FiStar } from 'react-icons/fi';
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

/* ── GraphQL query: contribution calendar + recent commit history ── */
const GQL_QUERY = `
query($username: String!, $from: DateTime!, $to: DateTime!) {
  user(login: $username) {
    contributionsCollection(from: $from, to: $to) {
      totalCommitContributions
      totalPullRequestContributions
      totalRepositoriesWithContributedCommits
      commitContributionsByRepository(maxRepositories: 10) {
        contributions(first: 5, orderBy: {field: OCCURRED_AT, direction: DESC}) {
          nodes {
            occurredAt
            commitCount
            repository { nameWithOwner url defaultBranchRef { target { ... on Commit { message url } } } }
          }
        }
        repository { name url }
      }
    }
  }
}`;

/* ── Fallback: REST events API (public events only) ── */
async function fetchViaREST(headers) {
  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/events?per_page=100`,
    { headers }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const events = await res.json();
  const items = [];
  events
    .filter(e => e.type === 'PushEvent')
    .forEach(event => {
      event.payload.commits?.forEach(c => {
        items.push({
          id: c.sha,
          repo: event.repo.name.replace(`${GITHUB_USERNAME}/`, ''),
          message: c.message.split('\n')[0].slice(0, 90),
          date: event.created_at,
          url: `https://github.com/${event.repo.name}/commit/${c.sha}`,
        });
      });
    });
  return items;
}

/* ── GraphQL fetch ── */
async function fetchViaGraphQL(headers) {
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - 90); // last 90 days

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: GQL_QUERY,
      variables: {
        username: GITHUB_USERNAME,
        from: from.toISOString(),
        to: now.toISOString(),
      },
    }),
  });
  if (!res.ok) throw new Error(`GraphQL HTTP ${res.status}`);
  const json = await res.json();
  if (json.errors) throw new Error(json.errors[0]?.message || 'GraphQL error');

  const cc = json.data?.user?.contributionsCollection;
  if (!cc) throw new Error('No data');

  const items = [];
  cc.commitContributionsByRepository?.forEach(byRepo => {
    byRepo.contributions?.nodes?.forEach(node => {
      items.push({
        id: `${byRepo.repository.name}-${node.occurredAt}`,
        repo: byRepo.repository.name,
        message: node.repository?.defaultBranchRef?.target?.message
          ? node.repository.defaultBranchRef.target.message.split('\n')[0].slice(0, 90)
          : `${node.commitCount} commit${node.commitCount > 1 ? 's' : ''}`,
        date: node.occurredAt,
        url: byRepo.repository.url,
        commitCount: node.commitCount,
      });
    });
  });

  // Sort newest first
  items.sort((a, b) => new Date(b.date) - new Date(a.date));

  return {
    items,
    stats: {
      totalCommits: cc.totalCommitContributions,
      totalPRs: cc.totalPullRequestContributions,
      totalRepos: cc.totalRepositoriesWithContributedCommits,
    },
  };
}

export default function GitHubActivity() {
  const { t, lang } = useTranslation();
  const [commits, setCommits]     = useState([]);
  const [stats, setStats]         = useState(null);
  const [status, setStatus]       = useState('loading');
  const [errorMsg, setErrorMsg]   = useState('');
  const [usingGQL, setUsingGQL]   = useState(false);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');

    const headers = { Accept: 'application/vnd.github+json' };
    if (TOKEN) headers['Authorization'] = `Bearer ${TOKEN}`;

    const run = async () => {
      try {
        if (TOKEN) {
          // GraphQL: sees private repos + accurate contribution data
          const { items, stats: s } = await fetchViaGraphQL(headers);
          if (cancelled) return;
          if (items.length === 0) { setStatus('empty'); return; }
          setCommits(items.slice(0, 15));
          setStats(s);
          setUsingGQL(true);
          setStatus('ok');
        } else {
          // REST fallback: public events only
          const items = await fetchViaREST(headers);
          if (cancelled) return;
          if (items.length === 0) { setStatus('empty'); return; }
          setCommits(items.slice(0, 15));
          setStatus('ok');
        }
      } catch (err) {
        if (!cancelled) {
          setErrorMsg(err.message || '');
          setStatus('error');
        }
      }
    };

    run();
    return () => { cancelled = true; };
  }, [lang]);

  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-white/10">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
        <h2 className="text-xl font-bold text-neutral-100 flex items-center gap-2.5">
          <FiGitCommit className="text-orange-400" size={22} />
          <span>{t('about.githubActivity')}</span>
          {usingGQL && stats && (
            <span className="text-xs font-mono text-neutral-500 font-normal ml-1">
              (son 90 gün)
            </span>
          )}
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

      {/* Stats row — only when GraphQL data is available */}
      {usingGQL && stats && (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Commit', value: stats.totalCommits, icon: <FiGitCommit size={14} /> },
            { label: 'PR', value: stats.totalPRs, icon: <FiGitPullRequest size={14} /> },
            { label: lang === 'tr' ? 'Repo' : 'Repos', value: stats.totalRepos, icon: <FiStar size={14} /> },
          ].map(({ label, value, icon }) => (
            <div
              key={label}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.35rem 0.8rem', borderRadius: '0.6rem',
                background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)',
                fontSize: '0.78rem', color: '#fb923c', fontWeight: 600,
              }}
            >
              {icon}
              <span style={{ color: '#f1f5f9', fontWeight: 700 }}>{value}</span>
              <span style={{ color: '#94a3b8', fontSize: '0.72rem' }}>{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {status === 'loading' && (
        <div className="space-y-3 pt-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-14 rounded-xl w-full" />
          ))}
        </div>
      )}

      {/* Error */}
      {status === 'error' && (
        <div className="flex items-start gap-3 p-4 rounded-2xl border border-red-500/30 bg-red-950/20 text-sm">
          <FiAlertCircle className="text-red-400 mt-0.5 shrink-0" size={18} />
          <div>
            <p className="text-red-300 font-semibold">{t('about.githubError')}</p>
            {errorMsg && <p className="text-red-400/80 mt-1 text-xs font-mono">{errorMsg}</p>}
          </div>
        </div>
      )}

      {/* Empty */}
      {status === 'empty' && (
        <p className="text-neutral-500 text-sm text-center py-6">{t('about.githubEmpty')}</p>
      )}

      {/* Commit list */}
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
                  {c.commitCount > 1 && (
                    <span className="text-[10px] font-mono text-neutral-600 bg-neutral-800 px-1.5 py-0.5 rounded">
                      ×{c.commitCount}
                    </span>
                  )}
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
