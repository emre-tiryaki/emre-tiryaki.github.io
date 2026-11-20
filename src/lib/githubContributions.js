/**
 * GitHub katkı verisi — GitHubActivity bileşeni ve arka plan ön yüklemesi
 * tarafından ORTAK kullanılır. Günlük localStorage önbelleği + eş zamanlı
 * isteklerde tek bir ağ çağrısı (paylaşılan promise) sağlar.
 */

export const GITHUB_USERNAME = 'emre-tiryaki';
const TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const CACHE_KEY = `gh_contributions_${GITHUB_USERNAME}`;

export const hasGithubToken = Boolean(TOKEN);

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { date, data } = JSON.parse(raw);
    if (date !== todayStr()) return null;
    return data; // { weeks, total }
  } catch {
    return null;
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ date: todayStr(), data }));
  } catch {
    /* quota / private mode — yoksay */
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

let inflight = null;

/** Önbellekten ya da GitHub GraphQL'den `{ weeks, total }` döner (tek istek). */
export function loadContributions() {
  const cached = readCache();
  if (cached) return Promise.resolve(cached);
  if (!TOKEN) return Promise.reject(new Error('no-token'));
  if (inflight) return inflight;

  inflight = fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ query: GQL, variables: { username: GITHUB_USERNAME } }),
  })
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then((json) => {
      if (json.errors) throw new Error(json.errors[0]?.message);
      const cal = json.data.user.contributionsCollection.contributionCalendar;
      const payload = { weeks: cal.weeks, total: cal.totalContributions };
      writeCache(payload);
      return payload;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}
