import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { copyFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// GitHub Pages statik host olduğu için SPA route'ları (/about, /blog/123 vb.)
// sunucu tarafında bulunamaz → 404 verir. Çözüm: build sonrası dist/404.html'i
// index.html kopyası yapmak. Pages 404'te bu dosyayı serve eder, React Router
// client-side route'u çözer.
function spaFallback() {
  return {
    name: 'spa-fallback-404',
    closeBundle() {
      const index = resolve('dist', 'index.html');
      const notFound = resolve('dist', '404.html');
      if (existsSync(index) && !existsSync(notFound)) {
        copyFileSync(index, notFound);
      }
    },
  };
}

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    spaFallback(),
  ],
  base: '/',
});
