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
