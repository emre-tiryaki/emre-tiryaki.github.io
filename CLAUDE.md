# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Personal portfolio SPA (React 19 + Vite 8 + TailwindCSS 4), deployed to GitHub Pages at https://emre-tiryaki.github.io. Code comments and README are largely in Turkish.

## Commands

```bash
npm run dev       # Vite dev server
npm run build     # production build to dist/ (also emits 404.html + dist/json/*)
npm run preview   # serve the built dist/
npm run lint      # ESLint 9 flat config (eslint.config.js)
```

There is no test suite. Deployment is automatic: pushing to `main` runs `.github/workflows/deploy.yml` (Node 22, `npm run build`, upload `dist/` to Pages). Build-time env vars come from repo secrets; see `.env.example` (`VITE_GITHUB_TOKEN` for the GitHub heatmap, `VITE_FIREBASE_*` currently unused in `src/`).

## Architecture

**Content is data-driven.** Nearly all portfolio content lives in `src/data/*.json` (experience, projects, skills, education, certifications, siteConfig). Pages import the JSON and map it onto card components; adding an experience or project normally means editing JSON, not JSX. The exception is the `/work-with-me` landing page, whose content lives in `src/data/professional.js` (`WORK_WITH_ME_DATA.tr` / `.en`).

**i18n (TR default, EN).** `LangProvider` (`src/hooks/useTranslation.jsx`) wraps the app in `main.jsx` and persists the choice in `localStorage['language']`. Components call `useTranslation()` from `src/hooks/translation.js`, which returns:
- `t('a.b.c', params)` — UI strings from `src/i18n/{tr,en}.json`, with `{name}` interpolation; returns the key path if missing. Add new keys to **both** files.
- `tData(field)` — localizes data fields that are either a plain string or `{ tr, en }` objects (the convention throughout `src/data/*.json`; falls back to `tr`).

**Routing / layout (`src/App.jsx`).** `BrowserRouter` with framer-motion `AnimatePresence` page transitions (each route wrapped in `PageTransition`). The normal shell is `StarfieldBackground` (react-three-fiber) + `Navbar` + a scrolling `<main>` that also mounts `VisitorTracker`. `/work-with-me` is special-cased in `AppContent` and rendered standalone (no starfield/navbar) with its own stylesheet `src/styles/professional.css`. New routes go in `AnimatedRoutes`.

**GitHub Pages SPA fallback.** `vite.config.js` has a `spaFallback` plugin that copies `dist/index.html` to `dist/404.html` so deep links resolve client-side.

**JSON "endpoints".** Two mechanisms expose raw data:
- `vite-plugin-json-dump.js` (build only) emits every `src/data/*.json` to `dist/json/<file>.json` plus an aggregated `dist/json/all.json`.
- The `/json?token=...` route (`JsonEndpointPage`) bundles the data client-side, gated by `siteConfig.jsonEndpointToken`. It is excluded from visitor tracking.

**Theme tokens.** `src/theme/theme.js` is the single source of truth for colors, glows, and per-type configs (`THEME_COLORS`, `PROJECT_CATEGORY_CONFIG`, `getExperienceTypeConfig`). Components should import from `src/theme` rather than hardcode `rgba`/hex. `src/index.css`'s `@theme {}` block mirrors a subset for Tailwind utilities; when changing a value in `theme.js`, update the mirror too.

**Asset registry.** `src/lib/media.js` centralizes asset URLs (`new URL(..., import.meta.url)` / `import.meta.glob`) and the Devicon CDN base. Data files refer to icons by key: `custom:*` keys in skills/education JSON map to local assets here, other keys fall back to `${DEVICON_BASE}${icon}.svg`. Certification logos resolve via `authorityKey`. Register new local icons/logos in this file instead of importing them in components.

**External services (client-side).**
- `VisitorTracker` POSTs once per session (prod only) to a Cloudflare Worker (`portfolio-visitor-notifier...workers.dev`); disabled when `localStorage['portfolio-notifications-disabled'] === '1'`.
- `GitHubActivity` queries the GitHub GraphQL API with `VITE_GITHUB_TOKEN`, caches daily in localStorage, and shows a fallback with no API call when the token is missing.
- `src/lib/translate.js` provides keyless TR↔EN auto-translation (Google Translate client endpoint, MyMemory fallback).

`siteConfig.json` holds global feature flags (e.g. `showHireMeCard`).
