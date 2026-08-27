/**
 * ─────────────────────────────────────────────────────────────
 * CENTRAL MEDIA / ASSET REGISTRY — SINGLE SOURCE OF TRUTH
 *
 * Every static asset URL and the shared Devicon CDN base used across the
 * app is resolved here exactly once. Previously these `new URL(...)`
 * / `import.meta.glob` calls and the `DEVICON_BASE` constant were
 * copy-pasted into multiple components (CertificationCard, EducationCard,
 * SkillGroup, SkillCard). Centralizing them means:
 *   - Adding a new certification authority / logo = edit ONE map here.
 *   - Changing the Devicon CDN version = edit ONE constant here.
 *   - No more duplicate `new URL()` for the same file in two components.
 *
 * Icons referenced by `custom:*` keys in skills.json / education.json map
 * to local assets via SKILL_CUSTOM_ICONS and CATEGORY_ICONS below.
 * ─────────────────────────────────────────────────────────────
 */

// Devicon CDN base — shared by SkillGroup and SkillCard.
export const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';

// ── Certification authority logos (keyed by cert.authorityKey) ──
const anthropicLogo = new URL('../assets/certification_icons/antrophic_certification_logo.jpeg', import.meta.url).href;
const inonuLogo = new URL('../assets/education/inonu_university_logo.png', import.meta.url).href;
const tuaLogo = new URL('../assets/education/inonu_university_logo.png', import.meta.url).href; // TÜBİTAK/UA fallback (no dedicated asset yet)

export const AUTHORITY_LOGOS = {
  anthropic: anthropicLogo,
  inonu: inonuLogo,
  tua: tuaLogo,
};

// ── Education school logos (keyed by education.logo filename) ──
export const EDUCATION_LOGOS = {
  inonu_university_logo: inonuLogo,
};

/** Resolve a certification authority logo by its `authorityKey`. */
export function getAuthorityLogo(authorityKey) {
  return AUTHORITY_LOGOS[authorityKey] || null;
}

/** Resolve an education logo by the raw filename stored in education.json `logo`. */
export function getEducationLogo(logoFilename) {
  return EDUCATION_LOGOS[logoFilename] || inonuLogo; // default to İnönü
}

// ── Skill category icons (keyed by skills.json `categoryIcon`) ──
const databaseIcon = new URL('../assets/skills/database.svg', import.meta.url).href;
const aiIcon = new URL('../assets/skills/ai-brain.svg', import.meta.url).href;
const networkIcon = new URL('../assets/skills/network-api.svg', import.meta.url).href;

export const CATEGORY_ICONS = {
  'custom:database': databaseIcon,
  database: databaseIcon,
  'custom:ai': aiIcon,
  ai: aiIcon,
  'ai-brain': aiIcon,
  'custom:network': networkIcon,
  network: networkIcon,
  api: networkIcon,
};

/** Resolve a skill category icon by its `categoryIcon` key. */
export function getCategoryIconSrc(icon) {
  if (!icon) return null;
  if (CATEGORY_ICONS[icon]) return CATEGORY_ICONS[icon];
  return `${DEVICON_BASE}${icon}.svg`;
}

// ── Skill item custom icons (keyed by skills.json item `icon`) ──
const ollamaIcon = new URL('../assets/skills/ollama.png', import.meta.url).href;
const tokioIcon = new URL('../assets/skills/tokio.svg', import.meta.url).href;
const websocketIcon = new URL('../assets/skills/websocket.svg', import.meta.url).href;

export const SKILL_CUSTOM_ICONS = {
  'custom:ollama': ollamaIcon,
  'custom:tokio': tokioIcon,
  'custom:websocket': websocketIcon,
};

/** Resolve a skill item icon by its `icon` key (falls back to Devicon CDN). */
export function getSkillIconSrc(icon) {
  if (!icon) return null;
  if (SKILL_CUSTOM_ICONS[icon]) return SKILL_CUSTOM_ICONS[icon];
  return `${DEVICON_BASE}${icon}.svg`;
}

// ── AI agent icons (rotating set for `custom:hermes` / `custom:agent`) ──
const agentIconModules = import.meta.glob('../assets/skills/agents/*.{svg,png,jpg,jpeg,webp}', {
  eager: true,
  import: 'default',
});

export const AGENT_ICONS = Object.entries(agentIconModules)
  .sort(([pathA], [pathB]) => {
    const isHermesA = pathA.toLowerCase().includes('hermes');
    const isHermesB = pathB.toLowerCase().includes('hermes');
    if (isHermesA && !isHermesB) return -1;
    if (!isHermesA && isHermesB) return 1;
    return pathA.localeCompare(pathB);
  })
  .map(([, url]) => url);

export default {
  DEVICON_BASE,
  AUTHORITY_LOGOS,
  EDUCATION_LOGOS,
  CATEGORY_ICONS,
  SKILL_CUSTOM_ICONS,
  AGENT_ICONS,
  getAuthorityLogo,
  getEducationLogo,
  getCategoryIconSrc,
  getSkillIconSrc,
};
