import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';

/**
 * Portfolio JSON-Dump plugin.
 *
 * Statik SPA (GitHub Pages) için "endpoint" desteği: src/data/*.json
 * dosyalarını build sırasında tek bir "all.json" toplam dosyasına ve ayrıca
 * ham haliyle "json/<dosya>.json" olarak Vite build çıktısına (dist/) emit eder.
 *
 * Önemli: Bu plugin diske elle dosya YAZMAZ; yalnızca build bundle'ına asset
 * olarak ekler (emitFile). Deploy sonrası şu URL'lerden ham JSON erişilir:
 *   - https://<site>/json/all.json        (tüm veri tek dosyada)
 *   - https://<site>/json/<dosya>.json    (birer birer)
 *
 * Not: Vite'ın publicDir kopyalaması build'in erken aşamasında olduğu için,
 * dosyaları doğrudan emitFile ile bundle'a ekliyoruz (generateBundle) —
 * böylece public/ kopyalamasından bağımsız çalışır.
 */
export function jsonDump({ dataDir = 'src/data' } = {}) {
  return {
    name: 'portfolio-json-dump',
    apply: 'build',
    generateBundle() {
      const src = resolve(dataDir);
      if (!existsSync(src)) {
        console.warn(`[json-dump] data dir bulunamadı: ${src}, atlanıyor.`);
        return;
      }

      const files = readdirSync(src).filter((f) => f.endsWith('.json'));
      const all = {};
      let count = 0;

      for (const file of files) {
        const raw = readFileSync(join(src, file), 'utf-8');
        const key = file.replace(/\.json$/, '');
        let parsed;
        try {
          parsed = JSON.parse(raw);
        } catch (e) {
          console.warn(`[json-dump] ${file} parse edilemedi, atlanıyor: ${e.message}`);
          continue;
        }
        all[key] = parsed;
        // Ham haliyle json/<dosya>.json olarak emit et
        this.emitFile({
          type: 'asset',
          fileName: `json/${file}`,
          source: raw,
        });
        count++;
      }

      // Tüm veriyi tek dosyada topla
      this.emitFile({
        type: 'asset',
        fileName: 'json/all.json',
        source: JSON.stringify(all, null, 2),
      });

      console.log(
        `[json-dump] ${count} dosya + all.json -> /json (dist/json/ altında emit edildi)`
      );
    },
  };
}
