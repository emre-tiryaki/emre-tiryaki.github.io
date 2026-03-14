# Emre Tiryaki - Personal Portfolio

Modern, cok dilli (EN/TR/ES) ve performans odakli bir portfolyo sitesi.
Proje React + Vite + TailwindCSS ile gelistirildi.

## Ozellikler

- Cok dilli arayuz: English, Turkce, Espanol
- Dil seciminin `localStorage` uzerinden kalici tutulmasi
- Hero bolumunde fotograflarla kart benzeri carousel deneyimi
- Ozlu soz API entegrasyonu + hata durumunda fallback ozlu sozler
- Proje kartlarinda gorsel preview ve dis linkler
- Responsive tasarim (mobil ve desktop uyumlu)

## Teknoloji Yigini

- React 19
- Vite 8
- TailwindCSS 3
- React Icons
- ESLint

## Proje Yapisi

`src/components` altinda bolum bazli bir yapi vardir:

- `SiteHeader` / `RightSideNav` / `SiteFooter`
- `HeroSection`
- `PhilosophySection`
- `SkillsSection` + `SkillCard`
- `ProjectsSection` + `ProjectCard`
- `ExperienceSection`

## Kurulum

```bash
npm install
```

## Gelistirme

```bash
npm run dev
```

## Build Alma

```bash
npm run build
```

## Build Onizleme

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Notlar

- Varsayilan dil: `English`
- Secilen dil `localStorage` icinde `language` anahtariyla saklanir.
- Hero sliderda son gorulen fotograf indexi `localStorage` ile korunur.