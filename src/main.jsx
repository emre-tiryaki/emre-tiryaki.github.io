import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

/* ── Easter Egg: Only visible in DevTools Console ── */
console.log(
  "%c╔══════════════════════════════════════════╗\n" +
  "║  👋 Merhaba!                             ║\n" +
  "╚══════════════════════════════════════════╝",
  "font-size:14px; color:#89B4FA; font-family:monospace;"
);
console.log(
  "%cBackend çalışıyor. Buraya kadar gelip logları okuyan\nİK'cı olamaz, kesin teknik ekiptensin. Selamlar! 🚀",
  "font-size:13px; color:#A6E3A1;"
);
console.log(
  "%c→ Kaynak kod: https://github.com/emre-tiryaki",
  "font-size:11px; color:#BAC2DE;"
);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
