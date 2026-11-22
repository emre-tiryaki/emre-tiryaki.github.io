import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit as limitTo,
  orderBy,
  query,
  serverTimestamp,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import { COMMENT_FALLBACK_AVATARS } from './media';

export const GUESTBOOK_LIMITS = { name: 40, message: 500, email: 120 };
const MY_COMMENTS_KEY = 'guestbook-my-comments';
const LAST_SUBMIT_KEY = 'guestbook-last-submit';
const COOLDOWN_MS = 60 * 1000;
const PENDING_TTL_MS = 30 * 24 * 60 * 60 * 1000; // reddedilen yorum sonsuza kadar "bekliyor" kalmasın
const AVATAR_SIZE = 96;
const AVATAR_RE = /^data:image\/webp;base64,[A-Za-z0-9+/=]+$/;
const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export const isGuestbookAvailable = Boolean(db);

/** Avatar <img src> olarak sadece güvenli WebP data URL kabul edilir (rules ile aynı kural). */
export const isSafeAvatar = (src) => typeof src === 'string' && src.length < 30000 && AVATAR_RE.test(src);
export const isValidEmail = (email) => email.length <= GUESTBOOK_LIMITS.email && EMAIL_RE.test(email);

/** Onaylı yorumlar, yeniden eskiye. */
export async function fetchApproved(max = 20) {
  if (!db) return [];
  const q = query(
    collection(db, 'guestbook'),
    where('approved', '==', true),
    orderBy('createdAt', 'desc'),
    limitTo(max),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name,
      message: data.message,
      avatar: isSafeAvatar(data.avatar) ? data.avatar : null,
      createdAt: data.createdAt?.toMillis?.() ?? null,
    };
  });
}

function readMine() {
  try {
    const list = JSON.parse(localStorage.getItem(MY_COMMENTS_KEY) || '[]');
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

function writeMine(list) {
  try {
    localStorage.setItem(MY_COMMENTS_KEY, JSON.stringify(list));
  } catch {
    /* localStorage dolu/kapalı: yorum yine gönderilmiştir, sadece yerel görünüm kaybolur */
  }
}

/** Gönderim için kalan bekleme süresi (sn); 0 ise gönderilebilir. */
export function cooldownRemaining() {
  const last = Number(localStorage.getItem(LAST_SUBMIT_KEY)) || 0;
  return Math.max(0, Math.ceil((last + COOLDOWN_MS - Date.now()) / 1000));
}

/**
 * Yorumu onaysız (approved:false) olarak yazar. E-posta varsa ayrı gizli koleksiyona,
 * aynı batch'te ve aynı id ile yazılır. Dönen kayıt yerel "onay bekliyor" listesine eklenir.
 */
export async function submitComment({ name, message, email, avatar }) {
  if (!db) throw new Error('guestbook-unavailable');
  const cleanName = name.trim();
  const cleanMessage = message.trim();
  const cleanEmail = (email || '').trim();
  if (!cleanName || !cleanMessage) throw new Error('guestbook-invalid');
  if (cleanEmail && !isValidEmail(cleanEmail)) throw new Error('guestbook-invalid-email');
  if (avatar && !isSafeAvatar(avatar)) throw new Error('guestbook-invalid-avatar');

  const ref = doc(collection(db, 'guestbook'));
  const batch = writeBatch(db);
  const data = {
    name: cleanName,
    message: cleanMessage,
    approved: false,
    createdAt: serverTimestamp(),
  };
  if (avatar) data.avatar = avatar;
  batch.set(ref, data);
  if (cleanEmail) batch.set(doc(db, 'guestbookPrivate', ref.id), { email: cleanEmail });
  await batch.commit();

  const mine = { id: ref.id, name: cleanName, message: cleanMessage, avatar: avatar || null, createdAt: Date.now() };
  writeMine([mine, ...readMine()]);
  localStorage.setItem(LAST_SUBMIT_KEY, String(Date.now()));
  return mine;
}

/**
 * Yerel yorumları sunucuyla karşılaştırır. Kurallar yalnızca approved==true okumaya izin verir:
 * okunabiliyorsa onaylanmıştır (yerel kayıt silinir), permission-denied ise hâlâ beklemededir.
 * Dönen liste hâlâ bekleyen yorumlardır.
 */
export async function checkMine() {
  const now = Date.now();
  const fresh = readMine().filter((c) => c?.id && now - c.createdAt < PENDING_TTL_MS);
  if (!db || fresh.length === 0) {
    writeMine(fresh);
    return [];
  }
  const results = await Promise.all(
    fresh.map(async (c) => {
      try {
        await getDoc(doc(db, 'guestbook', c.id));
        return { c, state: 'approved' };
      } catch (err) {
        return { c, state: err?.code === 'permission-denied' ? 'pending' : 'unknown' };
      }
    }),
  );
  // Ağ hatası gibi belirsiz durumlarda kaydı silme, beklemede göster
  const stillPending = results.filter((r) => r.state !== 'approved').map((r) => r.c);
  writeMine(stillPending);
  return stillPending;
}

/** Seçilen resmi ortadan kare kırpıp 96x96 WebP data URL'e çevirir (~5 KB). */
export async function resizeImageToDataUrl(file) {
  if (!file || !file.type.startsWith('image/')) throw new Error('guestbook-invalid-avatar');
  const bitmap = await createImageBitmap(file);
  try {
    const side = Math.min(bitmap.width, bitmap.height);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = AVATAR_SIZE;
    canvas.getContext('2d').drawImage(
      bitmap,
      (bitmap.width - side) / 2,
      (bitmap.height - side) / 2,
      side,
      side,
      0,
      0,
      AVATAR_SIZE,
      AVATAR_SIZE,
    );
    const url = canvas.toDataURL('image/webp', 0.8);
    if (!isSafeAvatar(url)) throw new Error('guestbook-invalid-avatar'); // tarayıcı WebP üretemedi
    return url;
  } finally {
    bitmap.close?.();
  }
}

/**
 * Fotoğrafı olmayan yorumlar için rastgele yedek avatar seçici. Seçim her sayfa açılışında
 * yapılır, belgeye kaydedilmez. Karıştırılmış desteden çeker; böylece liste bitmeden tekrar olmaz.
 */
export function createFallbackPicker() {
  let deck = [];
  return () => {
    if (COMMENT_FALLBACK_AVATARS.length === 0) return null;
    if (deck.length === 0) {
      deck = [...COMMENT_FALLBACK_AVATARS];
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
    }
    return deck.pop();
  };
}

/**
 * Yorumları butonun etrafına rastgele ama dengeli dağıtır: altın açı spirali üzerindeki sabit
 * yuvalar karıştırılıp sırayla verilir. Dönen değerler stage'e göre yüzde (x, y), derece (rotate),
 * katman sırası (z) ve giriş gecikmesidir. Seçim sayfa açılışında yapılır, kaydedilmez.
 */
const SLOTS = 24;
export function createScatter() {
  let order = [];
  let n = 0;
  return () => {
    if (order.length === 0) {
      order = Array.from({ length: SLOTS }, (_, i) => i);
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }
    }
    const k = order.pop();
    const radius = 0.5 + 0.5 * Math.sqrt((k + 0.5) / SLOTS); // 0.5 (merkeze yakın) .. 1 (kenar)
    const angle = k * 2.39996 + (Math.random() - 0.5) * 0.5;
    const jitter = () => (Math.random() - 0.5) * 6;
    return {
      x: `${50 + radius * 46 * Math.cos(angle) + jitter()}%`,
      y: `${50 + radius * 44 * Math.sin(angle) + jitter()}%`,
      rotate: Math.round((Math.random() - 0.5) * 14),
      z: 1 + Math.floor(Math.random() * 40),
      delay: Math.min(n++, 24) * 45,
    };
  };
}
