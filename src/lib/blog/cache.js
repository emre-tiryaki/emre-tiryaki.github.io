// localStorage önbellek + Firestore Timestamp serileştirme yardımcıları.
// Post ve yorum hook'ları arasında paylaşılır.

const CACHE_TTL_MS = 4 * 60 * 60 * 1000; // 4 saat

export function readCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL_MS) return null; // süresi dolmuş
    return data;
  } catch {
    return null;
  }
}

export function writeCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
  } catch {
    /* localStorage dolu veya private mod — sessizce geç */
  }
}

// Timestamp'i JSON'dan restore ederken .toDate() metodunu ekler.
export function restoreTimestamps(posts) {
  return posts.map((p) => ({
    ...p,
    createdAt: p.createdAt
      ? {
          seconds: p.createdAt.seconds,
          nanoseconds: p.createdAt.nanoseconds,
          toDate: () => new Date(p.createdAt.seconds * 1000),
        }
      : null,
  }));
}

// Firestore Timestamp'ini cache-safe düz JSON'a çevirir.
export function serializeTimestamps(posts) {
  return posts.map((p) => ({
    ...p,
    createdAt: p.createdAt
      ? { seconds: p.createdAt.seconds, nanoseconds: p.createdAt.nanoseconds }
      : null,
  }));
}
