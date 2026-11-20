/**
 * ─────────────────────────────────────────────────────────────
 * ARKA PLAN ÖN YÜKLEME (priority queue)
 *
 * Kullanıcı bir sayfaya varmadan önce o sayfanın görselleri ve verisi
 * (GitHub katkı grafiği) tarayıcı önbelleğine indirilir. Böylece sayfa
 * açıldığında <img> doğrudan önbellekten gelir.
 *
 * - Görevler öncelik sırasına göre çalışır (yüksek önce), eşzamanlılık sınırlıdır.
 * - Hakkımda: önce ekranda görünecek carousel fotoğrafı, sonra yan fotoğraflar,
 *   GitHub grafiği, ardından kalan fotoğraflar.
 * - Sonra diğer sayfalar (navbar sırasıyla); büyük galeri görselleri en sona.
 * - Kullanıcı bir sayfaya gidince o sayfanın grubu `boost()` ile öne alınır.
 * - saveData / çok yavaş bağlantıda sadece kritik (Hakkımda) görevler yüklenir.
 * ─────────────────────────────────────────────────────────────
 */

import skills from '../data/skills.json';
import {
  PERSONAL_PHOTOS,
  PROJECT_PREVIEW_IMAGES,
  EXPERIENCE_IMAGES,
  AGENT_ICONS,
  AUTHORITY_LOGOS,
  EDUCATION_LOGOS,
  CATEGORY_ICONS,
  SKILL_CUSTOM_ICONS,
  getSkillIconSrc,
  getCategoryIconSrc,
} from './media';
import { hasGithubToken, loadContributions } from './githubContributions';

const CAROUSEL_KEY = 'portfolio-carousel-index'; // PhotoCarousel ile aynı anahtar
const MAX_CONCURRENT = 3;
const BOOST = 1000;

/** Rota → ön yüklenmesi gereken gruplar */
const ROUTE_GROUPS = {
  '/about': ['about', 'github'],
  '/skills': ['skills'],
  '/education': ['education'],
  '/certifications': ['certifications'],
  '/projects': ['projects'],
  '/experience': ['experience', 'projects'],
};

const queue = []; // { key, run, priority, group }
const queued = new Set(); // key'ler (tekrarı önler)
let active = 0;
let started = false;
let limited = false; // veri tasarrufu / yavaş ağ

function pump() {
  while (active < MAX_CONCURRENT && queue.length) {
    queue.sort((a, b) => b.priority - a.priority);
    const task = queue.shift();
    active++;
    Promise.resolve()
      .then(task.run)
      .catch(() => {})
      .finally(() => {
        active--;
        pump();
      });
  }
}

function enqueue(key, run, priority, group) {
  if (!key || queued.has(key)) return;
  queued.add(key);
  queue.push({ key, run, priority, group });
}

function imageTask(url, high) {
  return () =>
    new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      if ('fetchPriority' in img) img.fetchPriority = high ? 'high' : 'low';
      img.onload = img.onerror = () => resolve();
      img.src = url;
    });
}

function addImage(url, priority, group) {
  enqueue(url, imageTask(url, priority >= 80), priority, group);
}

/** Bir gruptaki bekleyen görevleri öne alır (kullanıcı o sayfaya gitti/gidiyor). */
export function boost(group) {
  let changed = false;
  for (const t of queue) {
    if (t.group === group && t.priority < BOOST) {
      t.priority += BOOST;
      changed = true;
    }
  }
  if (changed) pump();
}

export function boostRoute(pathname) {
  (ROUTE_GROUPS[pathname] || []).forEach(boost);
}

function isConstrained() {
  const c = navigator.connection;
  return Boolean(c && (c.saveData || /(^|-)2g$/.test(c.effectiveType || '')));
}

/** Klasör adına göre ilk görsel (kapak) önce, kalanlar sonra gelsin. */
function enqueueGallery(entries, group, coverPriority, restPriority, coversOnly = false) {
  const seenFolders = new Set();
  for (const { path, url } of entries) {
    const folder = path.split('/').slice(0, -1).join('/');
    if (!seenFolders.has(folder)) {
      seenFolders.add(folder);
      addImage(url, coverPriority, group);
    } else if (!coversOnly) {
      addImage(url, restPriority, group);
    }
  }
}

function buildQueue() {
  /* 1) HAKKIMDA — en önde görünecek carousel fotoğrafı */
  const total = PERSONAL_PHOTOS.length;
  if (total) {
    const saved = parseInt(localStorage.getItem(CAROUSEL_KEY), 10);
    const cur = saved >= 0 && saved < total ? saved : 0;
    addImage(PERSONAL_PHOTOS[cur], 100, 'about');
    // yan fotoğraflar (aynı anda görünür) → sonra kalanlar
    addImage(PERSONAL_PHOTOS[(cur - 1 + total) % total], 90, 'about');
    addImage(PERSONAL_PHOTOS[(cur + 1) % total], 90, 'about');
    PERSONAL_PHOTOS.forEach((url) => addImage(url, 60, 'about'));
  }

  /* 2) HAKKIMDA — GitHub commit grafiği (görseller yan fotoğraflardan sonra, kalanlardan önce) */
  if (hasGithubToken) {
    enqueue('github:contributions', () => loadContributions().catch(() => {}), 85, 'github');
  }

  if (limited) return;

  /* 3) Beceriler */
  skills.forEach((g) => {
    if (g.categoryIcon) addImage(getCategoryIconSrc(g.categoryIcon), 50, 'skills');
    (g.items || []).forEach((it) => it.icon && !String(it.icon).startsWith('custom:agent') &&
      addImage(getSkillIconSrc(it.icon), 48, 'skills'));
  });
  Object.values(SKILL_CUSTOM_ICONS).forEach((u) => addImage(u, 48, 'skills'));
  Object.values(CATEGORY_ICONS).forEach((u) => addImage(u, 48, 'skills'));
  AGENT_ICONS.forEach((u) => addImage(u, 46, 'skills'));

  /* 4) Eğitim + sertifikalar */
  Object.values(EDUCATION_LOGOS).forEach((u) => addImage(u, 44, 'education'));
  Object.values(AUTHORITY_LOGOS).forEach((u) => addImage(u, 44, 'certifications'));

  /* 5) Projeler / Deneyim galerileri — en ağır olanlar en sona */
  // Sadece kapak görselleri; kalan galeri görselleri sayfada loading="lazy" ile yüklenir
  enqueueGallery(PROJECT_PREVIEW_IMAGES, 'projects', 40, 20, true);
  enqueueGallery(EXPERIENCE_IMAGES, 'experience', 30, 10, true);
}

/** Uygulama açılışında bir kez çağrılır; tarayıcı boştayken başlar. */
export function startBackgroundPreload(initialPath = '/') {
  if (started) return;
  started = true;
  limited = isConstrained();

  buildQueue();
  boostRoute(initialPath);

  const go = () => pump();
  const begin = () =>
    typeof requestIdleCallback === 'function' ? requestIdleCallback(go, { timeout: 1500 }) : setTimeout(go, 200);

  // Sayfanın kendi kaynakları (JS/CSS/ilk görseller) bittikten sonra başla
  if (document.readyState === 'complete') begin();
  else window.addEventListener('load', begin, { once: true });
}
