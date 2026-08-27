import { FiBriefcase, FiZap, FiAward } from 'react-icons/fi';

/**
 * ─────────────────────────────────────────────────────────────
 * CENTRAL PORTFOLIO THEME CONFIGURATION — SINGLE SOURCE OF TRUTH
 *
 * Every color / alpha / glow / shadow token used across the app is
 * declared here exactly once. Components MUST import from this file
 * instead of hardcoding raw `rgba(...)` / hex values.
 *
 * Keeping CSS in sync: `src/index.css` `@theme {}` block duplicates a
 * small subset of these tokens for Tailwind utility classes. When you
 * change a value here, mirror it in `src/index.css` (the block carries a
 * "mirror of src/theme/theme.js" comment). The two are intentionally
 * kept identical — this file is the authoritative source.
 * ─────────────────────────────────────────────────────────────
 */

export const THEME_COLORS = {
  // Brand Accent (Primary Orange Palette)
  accent: {
    primary: '#f97316',
    light: '#fb923c',
    dark: '#ea580c',
    lighter: '#fdba74',

    // Single low-alpha accent washes
    glow: 'rgba(249, 115, 22, 0.25)',
    glowStrong: 'rgba(249, 115, 22, 0.35)',
    bgSubtle: 'rgba(249, 115, 22, 0.1)',
    borderSubtle: 'rgba(249, 115, 22, 0.3)',

    // Accent alpha scale (kept in sync with usage across cards/buttons)
    a08: 'rgba(249, 115, 22, 0.08)',
    a12: 'rgba(249, 115, 22, 0.12)',
    a15: 'rgba(249, 115, 22, 0.15)',
    a20: 'rgba(249, 115, 22, 0.2)',
    a35: 'rgba(249, 115, 22, 0.35)',
    a40: 'rgba(249, 115, 22, 0.4)',
    a45: 'rgba(249, 115, 22, 0.45)',
    a50: 'rgba(249, 115, 22, 0.5)',
    a60: 'rgba(249, 115, 22, 0.6)',
    a70: 'rgba(249, 115, 22, 0.7)',
    a75: 'rgba(249, 115, 22, 0.75)',
    a85: 'rgba(249, 115, 22, 0.85)',
    a95: 'rgba(249, 115, 22, 0.95)',

    // Accent gradients (buttons / headings)
    gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
    gradientLight: 'linear-gradient(135deg, #fb923c, #f97316)',
  },

  // Backgrounds & Surfaces
  background: {
    primary: '#0a0a0a',
    secondary: '#121212',
    tertiary: '#1a1a1a',
    card: 'rgba(255, 255, 255, 0.03)',
    glass: 'rgba(255, 255, 255, 0.03)',
    glassHover: 'rgba(255, 255, 255, 0.06)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
    glassBorderHover: 'rgba(255, 255, 255, 0.15)',
  },

  // Typography Colors
  text: {
    primary: '#f8fafc',
    secondary: '#94a3b8',
    muted: '#71717a',
    dim: '#52525b',
    white: '#ffffff',
  },

  // Functional Status Colors
  status: {
    success: '#22c55e',
    successLight: '#4ade80',
    successSoft: '#34d399',
    successBg: 'rgba(16, 185, 129, 0.16)',
    successBorder: 'rgba(16, 185, 129, 0.4)',
    warning: '#eab308',
    warningLight: '#facc15',
    warningSoft: '#fcd34d',
    danger: '#ef4444',
    dangerLight: '#f87171',
    dangerSoft: '#fca5a5',
    dangerBorder: 'rgba(239, 68, 68, 0.3)',
    dangerBorderStrong: 'rgba(239, 68, 68, 0.6)',
    dangerBg: 'rgba(239, 68, 68, 0.12)',
    dangerBgStrong: 'rgba(239, 68, 68, 0.22)',
    dangerGlow: 'rgba(239, 68, 68, 0.25)',
    info: '#3b82f6',
  },

  /**
   * Neutral white/black alpha scale — the "glass" language of the UI.
   * Every `rgba(255,255,255,x)` in components should come from here.
   */
  surface: {
    white02: 'rgba(255, 255, 255, 0.02)',
    white025: 'rgba(255, 255, 255, 0.025)',
    white03: 'rgba(255, 255, 255, 0.03)',
    white035: 'rgba(255, 255, 255, 0.035)',
    white04: 'rgba(255, 255, 255, 0.04)',
    white045: 'rgba(255, 255, 255, 0.045)',
    white05: 'rgba(255, 255, 255, 0.05)',
    white055: 'rgba(255, 255, 255, 0.055)',
    white06: 'rgba(255, 255, 255, 0.06)',
    white07: 'rgba(255, 255, 255, 0.07)',
    white08: 'rgba(255, 255, 255, 0.08)',
    white09: 'rgba(255, 255, 255, 0.09)',
    white10: 'rgba(255, 255, 255, 0.1)',
    white12: 'rgba(255, 255, 255, 0.12)',
    white14: 'rgba(255, 255, 255, 0.14)',
    white15: 'rgba(255, 255, 255, 0.15)',
    white20: 'rgba(255, 255, 255, 0.2)',

    black60: 'rgba(0, 0, 0, 0.6)',
    black65: 'rgba(0, 0, 0, 0.65)',
    black70: 'rgba(0, 0, 0, 0.7)',

    // Navbar / overlay surfaces
    nav: 'rgba(12, 12, 12, 0.90)',
    navMobile: 'rgba(14, 14, 14, 0.97)',

    // Input / form fields
    input: 'rgba(255, 255, 255, 0.035)',
    inputFocus: 'rgba(255, 255, 255, 0.055)',
  },

  /**
   * Reusable card surface + hover recipe. Card components apply these
   * exact tokens so the "rest → hover" transition stays consistent.
   */
  card: {
    radius: '1.5rem',
    border: 'rgba(255, 255, 255, 0.08)',
    bg: 'rgba(255, 255, 255, 0.035)',
    bgHover: 'rgba(255, 255, 255, 0.045)',
    shadow: '0 16px 40px rgba(0, 0, 0, 0.4)',
    shadowHover: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 25px rgba(249, 115, 22, 0.06)',
    borderHover: 'rgba(249, 115, 22, 0.4)',
  },

  // Certification card rest/hover recipe (slightly tighter radius)
  certCard: {
    radius: '1.15rem',
    border: 'rgba(255, 255, 255, 0.08)',
    bg: 'rgba(255, 255, 255, 0.03)',
    bgHover: 'rgba(249, 115, 22, 0.07)',
    borderHover: 'rgba(249, 115, 22, 0.45)',
    shadowHover: '0 8px 25px rgba(249, 115, 22, 0.12)',
  },
};

/** Experience Types Configuration (Internship, Hackathon, Competition, Work)
 *  Unified across ExperienceCard, ExperienceDetailView, ExperiencePage */
export const EXPERIENCE_TYPE_CONFIG = {
  internship: {
    id: 'internship',
    icon: FiBriefcase,
    color: '#f97316',
    dotColor: '#f97316',
    border: 'rgba(249, 115, 22, 0.4)',
    bg: 'rgba(249, 115, 22, 0.1)',
    badgeBg: 'rgba(249, 115, 22, 0.12)',
    badgeBorder: 'rgba(249, 115, 22, 0.3)',
    badgeText: '#fb923c',
    hoverBorder: 'rgba(249, 115, 22, 0.45)',
    hoverBg: 'rgba(249, 115, 22, 0.05)',
    hoverShadow: 'rgba(249, 115, 22, 0.08)',
    titleHover: '#fdba74',
  },
  hackathon: {
    id: 'hackathon',
    icon: FiZap,
    color: '#10b981',
    dotColor: '#10b981',
    border: 'rgba(16, 185, 129, 0.4)',
    bg: 'rgba(16, 185, 129, 0.1)',
    badgeBg: 'rgba(16, 185, 129, 0.12)',
    badgeBorder: 'rgba(16, 185, 129, 0.3)',
    badgeText: '#34d399',
    hoverBorder: 'rgba(16, 185, 129, 0.45)',
    hoverBg: 'rgba(16, 185, 129, 0.05)',
    hoverShadow: 'rgba(16, 185, 129, 0.08)',
    titleHover: '#6ee7b7',
  },
  competition: {
    id: 'competition',
    icon: FiAward,
    color: '#eab308',
    dotColor: '#eab308',
    border: 'rgba(234, 179, 8, 0.4)',
    bg: 'rgba(234, 179, 8, 0.1)',
    badgeBg: 'rgba(234, 179, 8, 0.12)',
    badgeBorder: 'rgba(234, 179, 8, 0.3)',
    badgeText: '#facc15',
    hoverBorder: 'rgba(234, 179, 8, 0.45)',
    hoverBg: 'rgba(234, 179, 8, 0.05)',
    hoverShadow: 'rgba(234, 179, 8, 0.08)',
    titleHover: '#fde047',
  },
  work: {
    id: 'work',
    icon: FiBriefcase,
    color: '#3b82f6',
    dotColor: '#3b82f6',
    border: 'rgba(59, 130, 246, 0.4)',
    bg: 'rgba(59, 130, 246, 0.1)',
    badgeBg: 'rgba(59, 130, 246, 0.12)',
    badgeBorder: 'rgba(59, 130, 246, 0.3)',
    badgeText: '#60a5fa',
    hoverBorder: 'rgba(59, 130, 246, 0.45)',
    hoverBg: 'rgba(59, 130, 246, 0.05)',
    hoverShadow: 'rgba(59, 130, 246, 0.08)',
    titleHover: '#93c5fd',
  },
};

/** Helper to safely retrieve an experience type theme */
export function getExperienceTypeConfig(type) {
  return EXPERIENCE_TYPE_CONFIG[type] || EXPERIENCE_TYPE_CONFIG.internship;
}

/**
 * Project Category Filter Themes (Hackathon vs Personal Projects)
 */
export const PROJECT_CATEGORY_CONFIG = {
  hackathon: {
    id: 'hackathon',
    symbol: '⚡',
    color: '#c084fc',
    textActive: '#f3e8ff',
    textInactive: '#d8b4fe',
    bgActive: 'rgba(168, 85, 247, 0.22)',
    bgInactive: 'rgba(168, 85, 247, 0.05)',
    borderActive: 'rgba(168, 85, 247, 0.7)',
    borderInactive: 'rgba(168, 85, 247, 0.25)',
    glow: 'rgba(168, 85, 247, 0.25)',
    badgeBg: 'rgba(168, 85, 247, 0.14)',
    badgeBorder: 'rgba(168, 85, 247, 0.45)',
    noticeBg: 'rgba(168, 85, 247, 0.07)',
    noticeBorder: 'rgba(168, 85, 247, 0.3)',
  },
  personal: {
    id: 'personal',
    symbol: '💻',
    color: '#60a5fa',
    textActive: '#eff6ff',
    textInactive: '#93c5fd',
    bgActive: 'rgba(59, 130, 246, 0.22)',
    bgInactive: 'rgba(59, 130, 246, 0.05)',
    borderActive: 'rgba(59, 130, 246, 0.7)',
    borderInactive: 'rgba(59, 130, 246, 0.22)',
    glow: 'rgba(59, 130, 246, 0.25)',
  },
};

/**
 * Filter Columns Styles (Tags Violet vs Tech Orange)
 */
export const FILTER_THEME_CONFIG = {
  tags: {
    headerColor: '#c4b5fd',
    iconColor: '#a78bfa',
    textActive: '#e9d5ff',
    textInactive: '#a1a1aa',
    bgActive: 'rgba(139, 92, 246, 0.16)',
    bgInactive: 'rgba(255, 255, 255, 0.025)',
    borderActive: 'rgba(167, 139, 250, 0.55)',
    borderInactive: 'rgba(255, 255, 255, 0.07)',
    glow: 'rgba(139, 92, 246, 0.2)',
    scrollbarColor: 'rgba(139, 92, 246, 0.35)',
  },
  tech: {
    headerColor: '#fed7aa',
    iconColor: '#fb923c',
    textActive: '#fdba74',
    textInactive: '#a1a1aa',
    bgActive: 'rgba(249, 115, 22, 0.16)',
    bgInactive: 'rgba(255, 255, 255, 0.025)',
    borderActive: 'rgba(249, 115, 22, 0.55)',
    borderInactive: 'rgba(255, 255, 255, 0.07)',
    glow: 'rgba(249, 115, 22, 0.2)',
    scrollbarColor: 'rgba(249, 115, 22, 0.35)',
  },
};

export default {
  THEME_COLORS,
  EXPERIENCE_TYPE_CONFIG,
  getExperienceTypeConfig,
  PROJECT_CATEGORY_CONFIG,
  FILTER_THEME_CONFIG,
};
