/**
 * Skills sayfası yerleşim motoru.
 *
 * Her grup 1–3 "birim" genişlik kaplar ve kartlarını o kadar sütuna dizer
 * (1 birim → kartlar dikey sıralanır). Varsayılan genişlik beceri sayısına göre
 * seçilir (1 beceri → 1, 2 → 2, 3+ → 3); düzen motoru, alana daha iyi oturacaksa
 * grubu daha dar (dikey) yerleştirmeyi de dener. Sayfa genişliği T eşit birime
 * bölünür ve gruplar "skyline" algoritmasıyla bu ızgaraya yerleştirilir. Birim
 * sayısı (T), grup sırası ve grup genişlikleri, mevcut alana en iyi sığan
 * (kaydırma yok, boşluk minimum) kombinasyon seçilerek belirlenir.
 */

export const GAP = 20; // px — gruplar arası boşluk (1.25rem)
const MIN_UNIT = 100;  // px — bir birimin en dar hali
const MAX_UNIT = 115;  // px — bir birimin en geniş hali (kartlar ~70–100px kalır)
const MAX_PERMUTATION_GROUPS = 8; // bu sayıya kadar tüm sıralamalar denenir

/** Bir grubun alabileceği genişlikler (birim). 4 beceri 3 sütunda 3+1 kaldığı için denenmez. */
export function getSpanOptions(count) {
  if (count <= 1) return [1];
  if (count === 4) return [1, 2];
  return Array.from({ length: Math.min(3, count) }, (_, i) => i + 1);
}

/** Bir grubun varsayılan sütun sayısı (en fazla 3; 4 beceri 2+2 olarak dengelenir). */
export function getInnerColumns(count) {
  if (count <= 3) return Math.max(1, count);
  if (count === 4) return 2;
  return 3;
}

/** Grubun iç sütunları arasındaki boşluk — SkillGroup'taki clamp(0.5rem, 2vw, 0.75rem) ile aynı. */
export function innerGap(viewportWidth) {
  return Math.min(12, Math.max(8, viewportWidth * 0.02));
}

/** Grubun iç dolgusu — SkillGroup'taki 1rem ile aynı. */
export const GROUP_PADDING = 16;

/**
 * Ölçüm yapılamadığında kullanılan yükseklik tahmini (px).
 * Gerçek yükseklik DOM'dan ölçülünce bu değer yerini ölçüme bırakır.
 */
export function estimateGroupHeight(group, groupWidth, viewportWidth, cols = getInnerColumns(group.items.length)) {
  const pad = GROUP_PADDING;
  const gap = innerGap(viewportWidth);
  const cardWidth = (groupWidth - pad * 2 - gap * (cols - 1)) / cols;
  const charsPerLine = Math.max(4, Math.floor((cardWidth - 18) / 6.4));

  const linesFor = (name) => {
    let lines = 1;
    let used = 0;
    for (const word of name.split(/\s+/)) {
      const len = word.length;
      if (used === 0) used = len;
      else if (used + 1 + len <= charsPerLine) used += 1 + len;
      else { lines += 1; used = len; }
      if (len > charsPerLine) lines += Math.ceil(len / charsPerLine) - 1;
    }
    return lines;
  };

  let body = 0;
  const rows = Math.ceil(group.items.length / cols);
  for (let r = 0; r < rows; r++) {
    const rowItems = group.items.slice(r * cols, (r + 1) * cols);
    const maxLines = Math.max(...rowItems.map((i) => linesFor(i.name)));
    body += 32 + 2 + 40 + 9.6 + maxLines * 14.6; // padding + border + ikon + gap + etiket
  }
  body += gap * (rows - 1);

  const header = 26 + 16 + 16 + 1; // ikon + alt dolgu + alt margin + çizgi
  return Math.ceil(pad * 2 + 2 + header + body);
}

/** Skyline ile tek bir sıralamayı yerleştirir. */
function packOrder(order, T, heights, collect = false) {
  const skyline = new Array(T).fill(0);
  const placed = collect ? [] : null;
  let holes = 0;

  for (const g of order) {
    const span = g.span;
    let bestX = 0;
    let bestTop = Infinity;
    for (let x = 0; x + span <= T; x++) {
      let top = 0;
      for (let i = x; i < x + span; i++) if (skyline[i] > top) top = skyline[i];
      if (top < bestTop) { bestTop = top; bestX = x; }
    }
    const h = heights.get(g.id);
    for (let i = bestX; i < bestX + span; i++) {
      holes += bestTop - skyline[i];
      skyline[i] = bestTop + h + GAP;
    }
    if (collect) placed.push({ id: g.id, x: bestX, y: bestTop, span, h });
  }

  const height = Math.max(...skyline) - GAP;
  let bottomGaps = 0;
  for (const s of skyline) bottomGaps += height - (s - GAP);
  return { placed, height, waste: holes + bottomGaps };
}

function* permutations(arr) {
  const a = arr.slice();
  const n = a.length;
  const c = new Array(n).fill(0);
  yield a.slice();
  let i = 0;
  while (i < n) {
    if (c[i] < i) {
      const k = i % 2 === 0 ? 0 : c[i];
      [a[k], a[i]] = [a[i], a[k]];
      yield a.slice();
      c[i] += 1;
      i = 0;
    } else {
      c[i] = 0;
      i += 1;
    }
  }
}

function heuristicOrders(groups, heights) {
  const byHeight = [...groups].sort((a, b) => heights.get(b.id) - heights.get(a.id));
  const bySpan = [...groups].sort((a, b) => b.span - a.span || heights.get(b.id) - heights.get(a.id));
  return [groups, byHeight, bySpan];
}

function candidateOrders(groups, heights) {
  if (groups.length <= MAX_PERMUTATION_GROUPS) return permutations(groups);
  return heuristicOrders(groups, heights);
}

/** a, b'den daha iyi mi? Sığan düzen > sığmayan; sığanlar arasında az boşluk; sığmayanlarda az yükseklik. */
function isBetter(a, b, available) {
  if (!b) return true;
  const aFits = a.height <= available;
  const bFits = b.height <= available;
  if (aFits !== bFits) return aFits;
  if (aFits) {
    if (Math.abs(a.waste - b.waste) > 1) return a.waste < b.waste;
    return a.unit > b.unit; // eşitse daha geniş kartlar
  }
  if (a.height !== b.height) return a.height < b.height;
  return a.waste < b.waste;
}

/**
 * @param groups       skills.json girdisi
 * @param containerW   kullanılabilir genişlik (px)
 * @param availableH   kullanılabilir yükseklik (px)
 * @param viewportW    pencere genişliği (dolgu/boşluk tahmini için)
 * @param measured     Map<`${id}|${groupWidth}`, height> — DOM'dan ölçülmüş yükseklikler
 */
export function computeSkillsLayout(groups, containerW, availableH, viewportW, measured = new Map()) {
  if (!groups.length || containerW <= 0) return null;

  const maxT = Math.max(1, Math.floor((containerW + GAP) / (MIN_UNIT + GAP)));
  const minT = Math.min(maxT, Math.max(1, Math.ceil((containerW + GAP) / (MAX_UNIT + GAP))));

  let best = null;
  for (let T = minT; T <= maxT; T++) {
    const unit = (containerW - (T - 1) * GAP) / T;
    const widthOf = (span) => span * unit + (span - 1) * GAP;

    // Bir span seçimi için grupları hazırla (yükseklik: ölçüm varsa o, yoksa tahmin)
    const prepare = (spanOf) => {
      const prepared = groups.map((g) => {
        const span = spanOf.get(g.id);
        const width = widthOf(span);
        const key = `${g.id}|${Math.round(width)}`;
        const h = measured.get(key) ?? estimateGroupHeight(g, width, viewportW, span);
        return { id: g.id, span, h };
      });
      return { prepared, heights: new Map(prepared.map((p) => [p.id, p.h])) };
    };
    const evaluate = (spanOf, orders) => {
      const { prepared, heights } = prepare(spanOf);
      let top = null;
      for (const order of orders(prepared, heights)) {
        const result = packOrder(order, T, heights);
        const candidate = { height: result.height, waste: result.waste, T, unit, order, heights, spanOf };
        if (isBetter(candidate, top, availableH)) top = candidate;
      }
      return top;
    };

    // 1) Varsayılan genişliklerle tüm sıralamalar
    const defaults = new Map(groups.map((g) => [g.id, Math.min(getInnerColumns(g.items.length), T)]));
    let local = evaluate(defaults, candidateOrders);

    // 2) Gerekirse bir grubu daha dar (dikey) / daha geniş yap: tek tek dene, iyileşme olursa tut
    for (let pass = 0; pass < 4; pass++) {
      let improved = false;
      for (const g of groups) {
        for (const span of getSpanOptions(g.items.length)) {
          if (span > T || span === local.spanOf.get(g.id)) continue;
          const spanOf = new Map(local.spanOf).set(g.id, span);
          const prevOrder = local.order;
          const candidate = evaluate(spanOf, (prepared, heights) => {
            const byId = new Map(prepared.map((p) => [p.id, p]));
            return [
              prevOrder.map((o) => byId.get(o.id)),
              ...heuristicOrders(prepared, heights),
            ];
          });
          if (isBetter(candidate, local, availableH)) { local = candidate; improved = true; }
        }
      }
      if (!improved) break;
    }
    if (isBetter(local, best, availableH)) best = local;
  }
  const placed = packOrder(best.order, best.T, best.heights, true).placed;

  const unit = best.unit;
  const fits = best.height <= availableH;
  // Her sütunu (yatayda örtüşen gruplar kümesini) her zaman dikey ortala — kaydırma olsa bile
  const items = centerStacks(placed, best.height);
  return {
    T: best.T,
    unit,
    height: best.height,
    fits,
    items: items.map((p) => ({
      ...p,
      width: p.span * unit + (p.span - 1) * GAP,
    })),
  };
}

/**
 * Yatayda örtüşen gruplar aynı sütunda üst üste durur. Her sütunu, en uzun
 * sütunun yüksekliği içinde ortalar; kısa sütunlar yukarı yapışık kalmaz.
 */
function centerStacks(placed, totalHeight) {
  const parent = placed.map((_, i) => i);
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])));
  for (let i = 0; i < placed.length; i++) {
    for (let j = i + 1; j < placed.length; j++) {
      const a = placed[i];
      const b = placed[j];
      if (a.x < b.x + b.span && b.x < a.x + a.span) parent[find(i)] = find(j);
    }
  }
  const bottoms = new Map();
  placed.forEach((p, i) => {
    const root = find(i);
    bottoms.set(root, Math.max(bottoms.get(root) ?? 0, p.y + p.h));
  });
  return placed.map((p, i) => ({
    ...p,
    y: p.y + Math.floor((totalHeight - bottoms.get(find(i))) / 2),
  }));
}
