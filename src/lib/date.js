/**
 * ─────────────────────────────────────────────────────────────
 * CENTRAL DATE FORMATTING — SINGLE SOURCE OF TRUTH
 *
 * All date ranges / single dates in the data layer are stored as plain
 * ISO `YYYY-MM` strings (e.g. "2026-07"). This module is the ONLY place
 * that turns them into localized "Temmuz 2026" / "July 2026" text, so the
 * month-name tables live here exactly once instead of being hand-written
 * (and drift-prone) inside every JSON record.
 *
 * Usage:
 *   formatYearMonth("2026-07", "tr")          -> "Temmuz 2026"
 *   formatYearMonth("2026-07", "en")          -> "July 2026"
 *   formatDateRange("2026-07", "2026-08", "tr") -> "Temmuz 2026 – Ağustos 2026"
 * ─────────────────────────────────────────────────────────────
 */

export const MONTHS_TR = {
  1: 'Ocak',
  2: 'Şubat',
  3: 'Mart',
  4: 'Nisan',
  5: 'Mayıs',
  6: 'Haziran',
  7: 'Temmuz',
  8: 'Ağustos',
  9: 'Eylül',
  10: 'Ekim',
  11: 'Kasım',
  12: 'Aralık',
};

export const MONTHS_EN = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};

/**
 * Format an ISO "YYYY-MM" (or "YYYY-MM-DD") string into a localized
 * "Month YYYY" label. Returns "" for falsy / unparseable input.
 */
export function formatYearMonth(iso, lang = 'tr') {
  if (!iso || typeof iso !== 'string') return '';
  const [year, month] = iso.split('-').map(Number);
  if (!year || !month) return iso; // fallback: echo raw value
  const table = lang === 'en' ? MONTHS_EN : MONTHS_TR;
  return `${table[month]} ${year}`;
}

/**
 * Format a date range. Either endpoint may be null/undefined.
 * Returns a single formatted endpoint when only one is present,
 * or "Start – End" when both exist.
 */
export function formatDateRange(startIso, endIso, lang = 'tr') {
  const start = startIso ? formatYearMonth(startIso, lang) : '';
  const end = endIso ? formatYearMonth(endIso, lang) : '';
  if (start && end) return `${start} – ${end}`;
  return start || end || '';
}

/**
 * Resolve a date-ish value that may be either:
 *   - an ISO string ("2026-07"), or
 *   - a legacy { tr, en } bilingual object (kept for backward compat).
 * Returns the localized string for the requested language.
 */
export function resolveDate(value, lang = 'tr') {
  if (value == null) return '';
  if (typeof value === 'string') return formatYearMonth(value, lang);
  if (typeof value === 'object') return value[lang] ?? value.tr ?? '';
  return String(value);
}
