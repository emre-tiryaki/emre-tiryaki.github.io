// Ziyaretçi defteri yorumlarını sitenin diline çevirir (kaynak dil otomatik algılanır).
// Her yorum ayrı istekle çevrilir: tek istekte birleştirmek karışık dilli yorumlarda algılamayı bozar.
// Sonuçlar localStorage'da `id|hedefDil` anahtarıyla saklanır; aynı yorum ikinci kez çevrilmez.

const CACHE_KEY = 'guestbook-translations';
const CACHE_MAX = 300; // en eski kayıtlar atılır
const CONCURRENCY = 4; // gtx endpoint'ini sınırlamaya zorlamamak için

let cache = null;
const inflight = new Map();

function readCache() {
  if (cache) return cache;
  try {
    cache = JSON.parse(localStorage.getItem(CACHE_KEY)) || {};
  } catch {
    cache = {};
  }
  return cache;
}

function writeCache() {
  try {
    const keys = Object.keys(cache);
    for (const key of keys.slice(0, Math.max(0, keys.length - CACHE_MAX))) delete cache[key];
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Kota dolarsa önbellek yalnızca bellekte kalır
  }
}

async function viaGoogle(text, target) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`gtx ${res.status}`);
  const data = await res.json();
  if (!Array.isArray(data?.[0])) throw new Error('gtx shape');
  return { text: data[0].map((seg) => seg[0]).join(''), source: typeof data[2] === 'string' ? data[2] : null };
}

async function viaMyMemory(text, target) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=Autodetect|${target}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`mymemory ${res.status}`);
  const data = await res.json();
  const out = data?.responseData?.translatedText;
  if (!out || data.responseStatus !== 200) throw new Error('mymemory shape');
  // MyMemory'nin dil algılaması güvenilmez (ör. Almanca'yı "es" der); kaynak bilinmiyor sayılır
  return { text: out, source: null };
}

/** Kaynak dil hedefle aynıysa `{ text: null }` döner (orijinal gösterilir). Hata olursa reddeder. */
async function translateOne(text, target) {
  let result;
  try {
    result = await viaGoogle(text, target);
  } catch {
    result = await viaMyMemory(text, target);
  }
  const source = result.source?.toLowerCase().split('-')[0] ?? null;
  if (source === target || result.text.trim() === text.trim()) return { text: null, source };
  return { text: result.text, source };
}

/** Önbellekteki çevirileri senkron döndürür: { [id]: { text, source } }. */
export function cachedTranslations(comments, target) {
  const store = readCache();
  const out = {};
  for (const c of comments) {
    const hit = store[`${c.id}|${target}`];
    if (hit) out[c.id] = hit;
  }
  return out;
}

/**
 * Yorumları hedef dile çevirir. Önbellekte olanlar istek atmaz; çevrilemeyenler sonuçta yer almaz.
 * @returns {Promise<{ [id]: { text: string|null, source: string|null } }>}
 */
export async function translateComments(comments, target) {
  const store = readCache();
  const out = cachedTranslations(comments, target);
  const queue = comments.filter((c) => c.id && c.message?.trim() && !out[c.id]);
  let dirty = false;

  const worker = async () => {
    while (queue.length) {
      const c = queue.shift();
      const key = `${c.id}|${target}`;
      let job = inflight.get(key);
      if (!job) {
        job = translateOne(c.message, target).finally(() => inflight.delete(key));
        inflight.set(key, job);
      }
      try {
        const value = await job;
        out[c.id] = value;
        store[key] = value;
        dirty = true;
      } catch {
        // İki servis de başarısızsa yorum orijinal haliyle kalır
      }
    }
  };

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, queue.length) }, worker));
  if (dirty) writeCache();
  return out;
}
