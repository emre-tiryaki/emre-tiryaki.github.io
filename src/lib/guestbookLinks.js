import { FaGithub, FaInstagram, FaLinkedin, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import teamData from '../data/team.json';
import experienceData from '../data/experience.json';
import { FiGlobe, FiLink } from 'react-icons/fi';

export const MAX_LINKS = 4;
export const LINK_MAX_LENGTH = 200;

/** Tür → ikon + (varsa) zorunlu host kuralı. Sıra form ve kart sırasıdır. firestore.rules ile aynı kurallar. */
export const LINK_TYPES = {
  github: { icon: FaGithub, host: /^https:\/\/(www\.)?github\.com\//, placeholder: 'https://github.com/...' },
  linkedin: { icon: FaLinkedin, host: /^https:\/\/([a-z]+\.)?linkedin\.com\//, placeholder: 'https://linkedin.com/in/...' },
  website: { icon: FiGlobe, placeholder: 'https://...' },
  x: { icon: FaXTwitter, placeholder: 'https://x.com/...' },
  instagram: { icon: FaInstagram, placeholder: 'https://instagram.com/...' },
  youtube: { icon: FaYoutube, placeholder: 'https://youtube.com/...' },
  other: { icon: FiLink, placeholder: 'https://...' },
};
export const LINK_KEYS = Object.keys(LINK_TYPES);

/** Tek link geçerli mi: yalnızca https://, boşluksuz, ≤ 200, türün host kuralına uyar. */
export function isValidLink(type, url) {
  if (!LINK_TYPES[type] || typeof url !== 'string') return false;
  if (url.length > LINK_MAX_LENGTH || !/^https:\/\/[^\s]+$/.test(url)) return false;
  try {
    new URL(url);
  } catch {
    return false;
  }
  const host = LINK_TYPES[type].host;
  return !host || host.test(url);
}

/** Karşılaştırma için: küçük harf, `www.` ve sondaki `/` atılır. https dışı → null. */
export function normalizeLink(url) {
  if (typeof url !== 'string') return null;
  const m = url.trim().toLowerCase().match(/^https:\/\/(?:www\.)?(.+?)\/*$/);
  return m ? m[1] : null;
}

/** Geçersizleri atar, en fazla 4 geçerli link tutar. Okurken ve yazarken aynı fonksiyon. */
export function sanitizeLinks(obj) {
  const out = {};
  if (!obj || typeof obj !== 'object') return out;
  for (const key of LINK_KEYS) {
    if (Object.keys(out).length >= MAX_LINKS) break;
    const url = typeof obj[key] === 'string' ? obj[key].trim() : '';
    if (url && isValidLink(key, url)) out[key] = url;
  }
  return out;
}

/** Linkleri team.json ile eşler; ilk eşleşen üyenin id'si, yoksa null. Yalnızca admin önerisi içindir. */
export function matchTeamMember(links, teamData) {
  const mine = new Set(Object.values(links || {}).map(normalizeLink).filter(Boolean));
  if (mine.size === 0) return null;
  for (const [id, member] of Object.entries(teamData || {})) {
    const urls = [member.github, member.linkedin, member.portfolio];
    if (urls.some((u) => mine.has(normalizeLink(u)))) return id;
  }
  return null;
}

/** Takım üyesinin team.json linkleri (github, linkedin, portfolio → website); yorumcu eklemese de gösterilir. */
export function teamLinks(id) {
  const m = id && teamData[id];
  if (!m) return {};
  return sanitizeLinks({ github: m.github, linkedin: m.linkedin, website: m.portfolio });
}

/** Takım üyesinin yer aldığı deneyimler: [{ id, company }]. */
export function teamExperiences(id) {
  if (!id || !teamData[id]) return [];
  return experienceData
    .filter((e) => Array.isArray(e.team) && e.team.includes(id))
    .map((e) => ({ id: e.id, company: e.company }));
}
