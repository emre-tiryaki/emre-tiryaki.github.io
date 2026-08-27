// İki yönlü otomatik çeviri servisi (TR <-> EN)
// Google Translate ve MyMemory API fallback mekanizması ile sıfır konfigürasyonla çalışır.

export async function translateText(text, fromLang = 'tr', toLang = 'en') {
  if (!text || !text.trim()) return '';

  // Paragraf bazlı bölerek Markdown ve satır sonu yapısını koruyoruz
  const paragraphs = text.split('\n');
  const translatedParagraphs = [];

  for (const para of paragraphs) {
    if (!para.trim()) {
      translatedParagraphs.push('');
      continue;
    }

    let translated = null;

    // 1. Birincil: Google Translate Client Endpoint
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${fromLang}&tl=${toLang}&dt=t&q=${encodeURIComponent(para)}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data && data[0]) {
          translated = data[0].map((item) => item[0]).join('');
        }
      }
    } catch {
      // Birincil servis yanıt vermezse yedeğe geçer
    }

    // 2. Yedek: MyMemory API
    if (!translated) {
      try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(para)}&langpair=${fromLang}|${toLang}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data?.responseData?.translatedText) {
            translated = data.responseData.translatedText;
          }
        }
      } catch {
        // İkisi de başarısız olursa orijinal paragrafı koru
      }
    }

    translatedParagraphs.push(translated || para);
  }

  return translatedParagraphs.join('\n');
}

export async function translateTrToEn(text) {
  return translateText(text, 'tr', 'en');
}

export async function translateEnToTr(text) {
  return translateText(text, 'en', 'tr');
}
