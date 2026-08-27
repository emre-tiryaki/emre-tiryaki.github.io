import { FiBriefcase, FiZap, FiAward } from 'react-icons/fi';

/**
 * ─────────────────────────────────────────────────────────────
 * CENTRAL PORTFOLIO THEME CONFIGURATION
 * Single source of truth for colors, categories, and typography
 * ─────────────────────────────────────────────────────────────
 */

export const THEME_COLORS = {
  // Brand Accent (Primary Orange Palette)
  accent: {
    primary: '#f97316',
    light: '#fb923c',
    dark: '#ea580c',
    lighter: '#fdba74',
    glow: 'rgba(249, 115, 22, 0.25)',
    bgSubtle: 'rgba(249, 115, 22, 0.1)',
    borderSubtle: 'rgba(249, 115, 22, 0.3)',
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
    warning: '#eab308',
    danger: '#ef4444',
    info: '#3b82f6',
  },
};

/**
 * Experience Types Configuration (Internship, Hackathon, Competition, Work)
 * Unified across ExperienceCard, ExperienceDetailView, ExperiencePage
 */
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
