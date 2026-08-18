# Emre Tiryaki - Personal Portfolio

Site: https://emre-tiryaki.github.io

Modern, çok dilli (TR/EN) ve performans odaklı bir kişisel portfolyo sitesi.
React 19 + Vite 8 + TailwindCSS 4 ile geliştirildi.

## Özellikler

- Çok dilli arayüz: Türkçe / English (varsayılan: Türkçe)
- Dil seçimi `localStorage` üzerinden kalıcı tutulur (`language` anahtarı)
- 3B yıldız arka planı (Three.js / react-three-fiber)
- Sayfa geçiş animasyonları (framer-motion) + proje slider animasyonu
- Ana sayfada ASCII terminal animasyonu (donut / cube / globe / matrix) + typewriter metin
- Deneyim sayfasında timeline + türe göre filtreleme (staj / hackathon / yarışma / iş)
- Proje kartlarında görsel preview ve kaynak kod / canlı demo linkleri
- Yetenek kartlarında hover tooltip (portal ile overflow'dan bağımsız)
- GitHub aktivite ısı haritası (GraphQL API, günlük localStorage cache + token yoksa fallback)
- Responsive tasarım (mobil ve masaüstü uyumlu)

## Teknoloji Yığını

- React 19
- react-router-dom 7
- framer-motion 13
- @react-three/fiber + @react-three/drei (Three.js)
- react-icons 5
- Vite 8
- TailwindCSS 4 (Vite plugin, `@theme` ile token'lar)
- ESLint 9 (flat config)

## Proje Yapısı

Tüm içerik `src/data/*.json` dosyalarında tutulur; sayfalar bu veriyi kart
bileşenlerine map'ler. Yeni deneyim/proje eklemek için JSON'a kayıt eklenir.

```
src/
  main.jsx                      # LangProvider + root render
  App.jsx                       # Router + sayfa geçişleri + layout
  index.css                     # Tailwind import + tema token'ları + glass/scrollbar stilleri
  hooks/
    useTranslation.jsx          # i18n çekirdeği (t / tData)
  i18n/
    tr.json, en.json            # UI metinleri
  data/
    experience.json             # staj / hackathon / yarışma / iş kayıtları
    projects.json               # proje kart verisi
    skills.json                 # yetenek grupları
    certifications.json         # sertifikalar
    education.json              # eğitim
    siteConfig.json             # global flag'ler (ör. showHireMeCard)
  pages/                        # Home, About, Skills, Education, Experience, Projects, Certifications
  components/
    layout/                     # Navbar, StarfieldBackground, PageTransition
    home/                       # TypewriterText, AsciiAnimation (+ ascii/* animasyon modülleri)
    about/                      # PhotoCarousel, SocialLinks, LanguagesSection, GitHubActivity
    experience/                 # ExperienceCardFactory + cards/ (Internship, Work, Competition, Hackathon)
    projects/                   # ProjectSlider, ProjectCard
    skills/                     # SkillGroup, SkillCard
    certifications/             # CertificationCard
    education/                   # EducationCard
```

## Kurulum

```bash
npm install
```

## Geliştirme

```bash
npm run dev
```

## Build Alma

```bash
npm run build
```

## Build Önizleme

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Notlar

- Varsayılan dil: `Türkçe`. Seçilen dil `localStorage` içinde `language` anahtarıyla saklanır.
- GitHub aktivite ısı haritası `VITE_GITHUB_TOKEN` ortam değişkeni gerektirir;
  token tanımsızsa zarif bir "token yok" mesajı gösterilir (API call yapılmaz).
- Hero/photo carousel'da son görülen fotoğraf indexi `localStorage` ile korunur.
- Tüm görsel varlıklar `import.meta.glob` / `new URL` ile Vite build'e bundle edilir.
