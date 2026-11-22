/**
 * Yorum kartlarını sahnede üst üste binmeyecek şekilde yerleştirir (piksel cinsinden).
 * Her kartın kendi tohumundan (`layout.seed`) aday konumlar üretilir; ilk çakışmasız aday seçilir.
 * Hepsi çakışmasız sığana kadar ölçek (k) küçültülür; sığmazsa en küçük ölçekte en az çakışan
 * konumlar kullanılır. Kullanıcının sabitlediği kartlar (`pinned`) olduğu yerde kalır, diğerleri
 * onların etrafına yerleşir.
 */
export const MAX_SCALE = 1;
export const MIN_SCALE = 0.4;
const STEP = 0.05;
const CANDIDATES = 80;
const GAP_REM = 0.5; // kartlar arası asgari boşluk
const MARGIN_REM = 0.5; // sahne kenarı boşluğu

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function overlapArea(a, b) {
  const ox = Math.min(a.x + a.w / 2, b.x + b.w / 2) - Math.max(a.x - a.w / 2, b.x - b.w / 2);
  const oy = Math.min(a.y + a.h / 2, b.y + b.h / 2) - Math.max(a.y - a.h / 2, b.y - b.h / 2);
  return ox > 0 && oy > 0 ? ox * oy : 0;
}

function place(seeds, pinned, W, H, rem, k) {
  const gap = GAP_REM * rem;
  const margin = MARGIN_REM * rem;
  // Genişlik CSS'teki min(16rem*k, 46vw) ile aynı; yükseklik yaklaşık
  const w = Math.min(16 * rem * k, W * 0.46) + gap;
  const h = 9.2 * rem * k + gap;
  const fixed = [{ x: W / 2, y: H / 2, w: 9 * rem, h: 10 * rem }]; // merkezdeki buton
  const placed = [];
  const out = new Array(seeds.length);
  let total = 0;

  seeds.forEach((_, i) => {
    if (!pinned[i]) return;
    const p = { x: pinned[i].x, y: pinned[i].y, w, h };
    placed.push(p);
    out[i] = p;
  });

  seeds.forEach((seed, i) => {
    if (pinned[i]) return;
    const rnd = mulberry32(seed);
    const minX = Math.min(w / 2 + margin, W / 2);
    const maxX = Math.max(W - w / 2 - margin, W / 2);
    const minY = Math.min(h / 2 + margin, H / 2);
    const maxY = Math.max(H - h / 2 - margin, H / 2);
    let best = null;
    for (let i = 0; i < CANDIDATES; i++) {
      const cand = { x: minX + rnd() * (maxX - minX), y: minY + rnd() * (maxY - minY), w, h };
      let pen = 0;
      for (const o of fixed) pen += overlapArea(cand, o);
      for (const o of placed) pen += overlapArea(cand, o);
      if (!best || pen < best.pen) best = { ...cand, pen };
      if (pen === 0) break;
    }
    total += best.pen;
    placed.push(best);
    out[i] = best;
  });
  return { placed: out, total };
}

/**
 * @param {number[]} seeds kart tohumları (sırayla yerleştirilir)
 * @param {({x:number,y:number}|null)[]} pinned seeds ile aynı sırada; doluysa kart o piksel konumda sabit
 * @returns {{ scale: number, positions: {x:number,y:number}[] }}
 */
export function packTiles(seeds, pinned, W, H, rem) {
  let result = null;
  let k = MAX_SCALE;
  for (; k >= MIN_SCALE - 1e-9; k -= STEP) {
    result = place(seeds, pinned, W, H, rem, k);
    if (result.total === 0) break;
  }
  const scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, k));
  return { scale, positions: result.placed.map(({ x, y }) => ({ x, y })) };
}
