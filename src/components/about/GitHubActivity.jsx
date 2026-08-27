import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FiExternalLink } from 'react-icons/fi';
import { useTranslation } from '../../hooks/translation';

const GITHUB_USERNAME = 'emre-tiryaki';
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

/* ── LocalStorage cache — 1 API call per user per calendar day ── */
const CACHE_KEY = `gh_contributions_${GITHUB_USERNAME}`;

function todayStr() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { date, data } = JSON.parse(raw);
    if (date !== todayStr()) return null;   // expired — new calendar day
    return data;                            // { weeks, total }
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ date: todayStr(), data }));
  } catch {
    /* quota exceeded or private browsing — silently ignore */
  }
}

const GQL = `
query($username: String!) {
  user(login: $username) {
    contributionsCollection {
      contributionCalendar {
        totalContributions
        weeks {
          firstDay
          contributionDays {
            date
            contributionCount
            weekday
          }
        }
      }
    }
  }
}`;

function countToColor(n) {
  if (n === 0)  return '#1a1a1a';
  if (n < 4)   return '#7c2d12';
  if (n < 8)   return '#c2410c';
  if (n < 16)  return '#ea580c';
  return '#fb923c';
}

/* Derive month label positions from weeks */
function monthLabels(weeks, cellW, cellH, gap) {
  const seen = new Set();
  return weeks.flatMap((week, wi) => {
    const d = new Date(week.firstDay + 'T12:00:00');
    const name = d.toLocaleString('en-US', { month: 'short' });
    if (seen.has(name)) return [];
    seen.add(name);
    return [{ name, x: wi * (cellW + gap) }];
  });
}

const DAY_LABELS = [
  { label: '',    row: 0 },
  { label: 'Mon', row: 1 },
  { label: '',    row: 2 },
  { label: 'Wed', row: 3 },
  { label: '',    row: 4 },
  { label: 'Fri', row: 5 },
  { label: '',    row: 6 },
];

/* Portal tooltip — escapes all overflow containers */
function TooltipPortal({ x, y, date, count, lang, t }) {
  const text = count === 0
    ? t('about.githubNoContributions')
    : (count === 1 ? t('about.githubContributionSingle', { n: count }) : t('about.githubContributionMultiple', { n: count }));

  const dateStr = new Date(date + 'T12:00:00').toLocaleDateString(
    lang === 'tr' ? 'tr-TR' : 'en-US',
    { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }
  );

  return createPortal(
    <div
      style={{
        position: 'fixed',
        left: x,
        top: y,
        transform: 'translate(-50%, -100%)',
        marginTop: -8,
        zIndex: 99999,
        pointerEvents: 'none',
        background: 'rgba(10,10,10,0.97)',
        border: '1px solid rgba(249,115,22,0.5)',
        borderRadius: '0.5rem',
        padding: '0.3rem 0.65rem',
        fontSize: '0.7rem',
        color: '#e2e8f0',
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 20px rgba(0,0,0,0.7)',
      }}
    >
      <span style={{ color: '#fb923c', fontWeight: 700 }}>{text}</span>
      {' on '}
      <span>{dateStr}</span>
    </div>,
    document.body
  );
}

export default function GitHubActivity() {
  const { t, lang } = useTranslation();
  const [weeks, setWeeks]       = useState([]);
  const [total, setTotal]       = useState(0);
  const [status, setStatus]     = useState('loading');
  const [tooltip, setTooltip]   = useState(null);
  const [svgWidth, setSvgWidth] = useState(600);
  const wrapperRef              = useRef(null);

  /* Measure container width for responsive SVG */
  useEffect(() => {
    if (!wrapperRef.current) return;
    const ro = new ResizeObserver(entries => {
      setSvgWidth(entries[0].contentRect.width);
    });
    ro.observe(wrapperRef.current);
    setSvgWidth(wrapperRef.current.clientWidth);
    return () => ro.disconnect();
  }, []);

  /* Fetch */
  useEffect(() => {
    if (!TOKEN) {
      queueMicrotask(() => setStatus('no-token'));
      return;
    }

    /* ── 1. Try cache first ── */
    const cached = readCache();
    if (cached) {
      queueMicrotask(() => {
        setWeeks(cached.weeks);
        setTotal(cached.total);
        setStatus('ok');
      });
      return;   // no API call needed today
    }

    /* ── 2. Cache miss → fetch from GitHub GraphQL ── */
    fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({ query: GQL, variables: { username: GITHUB_USERNAME } }),
    })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(json => {
        if (json.errors) throw new Error(json.errors[0]?.message);
        const cal = json.data.user.contributionsCollection.contributionCalendar;
        const payload = { weeks: cal.weeks, total: cal.totalContributions };
        writeCache(payload);          // persist for the rest of today
        setWeeks(payload.weeks);
        setTotal(payload.total);
        setStatus('ok');
      })
      .catch(() => setStatus('error'));
  }, []);

  /* SVG layout math */
  const DAY_LABEL_W = 28;
  const MONTH_LABEL_H = 18;
  const LEGEND_H = 22;
  const GAP = 2;
  const numWeeks = weeks.length || 53;
  /* cellW fills exactly the available width */
  const cellW = Math.max(8, Math.floor((svgWidth - DAY_LABEL_W - (numWeeks - 1) * GAP) / numWeeks));
  const cellH = cellW;    /* square cells */
  const STEP_X = cellW + GAP;
  const STEP_Y = cellH + GAP;
  const gridH = 7 * STEP_Y - GAP;
  const svgH  = MONTH_LABEL_H + gridH + LEGEND_H + 8;

  const months = weeks.length ? monthLabels(weeks, cellW, cellH, GAP) : [];

  const handleMouseEnter = useCallback((e, day) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      x: rect.left + rect.width / 2,
      y: rect.top - 6,
      date: day.date,
      count: day.contributionCount,
    });
  }, []);

  const handleMouseLeave = useCallback(() => setTooltip(null), []);

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '1rem',
        padding: '1.25rem 1.5rem',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' }}>
          {status === 'ok' && (
            <>
              <span style={{ color: '#fb923c', fontWeight: 700 }}>{total.toLocaleString()}</span>
              {' '}{t('about.githubContributionsYear')}
            </>
          )}
          {status !== 'ok' && (
            <span style={{ color: '#475569', fontSize: '0.75rem' }}>{t('about.githubActivity')}</span>
          )}
        </p>
        <a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank" rel="noreferrer"
          style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: '#475569', textDecoration: 'none' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fb923c'}
          onMouseLeave={e => e.currentTarget.style.color = '#475569'}
        >
          @{GITHUB_USERNAME} <FiExternalLink size={10} />
        </a>
      </div>

      {/* SVG container — ref for width measurement */}
      <div ref={wrapperRef} style={{ width: '100%' }}>

        {/* Loading skeleton */}
        {status === 'loading' && (
          <svg width="100%" height={svgH} style={{ display: 'block' }}>
            {Array.from({ length: 53 }).map((_, wi) =>
              Array.from({ length: 7 }).map((_, di) => (
                <rect
                  key={`${wi}-${di}`}
                  x={DAY_LABEL_W + wi * STEP_X}
                  y={MONTH_LABEL_H + di * STEP_Y}
                  width={cellW} height={cellH} rx={2}
                  fill="#1e293b" opacity={0.6 + 0.1 * ((wi + di) % 4)}
                />
              ))
            )}
          </svg>
        )}

        {(status === 'no-token' || status === 'error') && (
          <p style={{ color: '#475569', fontSize: '0.75rem', textAlign: 'center', padding: '2rem 0' }}>
            {t('about.githubError')}
          </p>
        )}

        {status === 'ok' && weeks.length > 0 && (
          <svg
            width="100%"
            height={svgH}
            style={{ display: 'block', overflow: 'visible' }}
          >
            {/* Month labels */}
            {months.map(({ name, x }) => (
              <text
                key={name}
                x={DAY_LABEL_W + x}
                y={MONTH_LABEL_H - 4}
                fontSize={10}
                fill="#475569"
              >
                {name}
              </text>
            ))}

            {/* Day-of-week labels */}
            {DAY_LABELS.map(({ label, row }) => (
              <text
                key={row}
                x={DAY_LABEL_W - 4}
                y={MONTH_LABEL_H + row * STEP_Y + cellH / 2 + 3}
                fontSize={9}
                fill="#374151"
                textAnchor="end"
              >
                {label}
              </text>
            ))}

            {/* Contribution cells */}
            {weeks.map((week, wi) =>
              week.contributionDays.map((day) => (
                <rect
                  key={day.date}
                  x={DAY_LABEL_W + wi * STEP_X}
                  y={MONTH_LABEL_H + day.weekday * STEP_Y}
                  width={cellW}
                  height={cellH}
                  rx={2}
                  fill={countToColor(day.contributionCount)}
                  stroke="rgba(255,255,255,0.04)"
                  strokeWidth={0.5}
                  style={{ cursor: 'pointer', transition: 'filter 0.1s' }}
                  onMouseEnter={e => { e.currentTarget.setAttribute('filter', 'brightness(1.5)'); handleMouseEnter(e, day); }}
                  onMouseLeave={e => { e.currentTarget.removeAttribute('filter'); handleMouseLeave(); }}
                />
              ))
            )}

            {/* Legend */}
            {(() => {
              const legendY = MONTH_LABEL_H + gridH + 10;
              const samples = [0, 2, 5, 10, 16];
              const legendX = DAY_LABEL_W;
              return (
                <>
                  <text x={legendX} y={legendY + cellH - 1} fontSize={9} fill="#374151">{t('about.githubLess')}</text>
                  {samples.map((n, i) => (
                    <rect
                      key={n}
                      x={legendX + 28 + i * (cellW + 3)}
                      y={legendY}
                      width={cellW} height={cellH} rx={2}
                      fill={countToColor(n)}
                      stroke="rgba(255,255,255,0.04)" strokeWidth={0.5}
                    />
                  ))}
                  <text x={legendX + 28 + samples.length * (cellW + 3) + 3} y={legendY + cellH - 1} fontSize={9} fill="#374151">{t('about.githubMore')}</text>
                </>
              );
            })()}
          </svg>
        )}
      </div>

      {/* Portal tooltip — renders into body, escapes all overflow */}
      {tooltip && <TooltipPortal {...tooltip} lang={lang} t={t} />}
    </div>
  );
}
