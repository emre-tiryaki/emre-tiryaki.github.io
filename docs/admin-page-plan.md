# /admin sayfası — tasarım ve plan

Durum: tasarım onaylandı, kod henüz yazılmadı.

## Amaç

Guestbook yorumlarını onaylamak/kaldırmak/silmek için sadece sahibinin girebildiği bir `/admin` sayfası.
Site statik (GitHub Pages), backend yok. Bu yüzden istemci tarafında kullanıcı adı/şifre kontrolü güvenlik sağlamaz;
gerçek koruma Firebase Authentication + Firestore rules ile yapılır.

## Kararlar

1. **Auth:** Firebase Auth, Email/Password sağlayıcısı. Giriş e-posta + şifre ile. Kayıt (signup) arayüzü yok.
2. **Beni hatırla:** Checkbox, varsayılan işaretsiz.
   - İşaretsiz: `browserSessionPersistence` (sekme kapanınca çıkış).
   - İşaretli: `browserLocalPersistence` (Çıkış'a basana kadar açık).
   - "Çıkış" butonu her zaman görünür.
3. **Admin kontrolü:** Kodda/rules'ta uid veya e-posta hardcode edilmez.
   - Firestore'da `admins/{uid}` marker belgesi, Console'dan elle oluşturulur.
   - `firestore.rules` içinde `isAdmin()` = `exists(/databases/$(database)/documents/admins/$(request.auth.uid))`.
   - `admins` koleksiyonu istemciye kapalı (`read, write: if false`).
4. **Rules değişiklikleri** (`firestore.rules`):
   - `guestbook`: admin tüm belgeleri okuyabilir; sadece `approved` alanını güncelleyebilir; silebilir. Herkese açık kurallar aynı kalır.
   - `guestbookPrivate`: admin okuyabilir (e-postaları görmek için).
5. **Sayfa:**
   - Lazy `/admin` chunk (`src/pages/AdminPage.jsx`), `App.jsx` içinde `pageLoaders`'a eklenir, idle prefetch dışında tutulur (guestbook gibi).
   - Navbar linki yok, `noindex`, `VisitorTracker` dışında.
   - Normal shell (starfield + navbar), renkler `src/theme` üzerinden.
   - Sekmeler: Bekleyen (varsayılan) / Onaylı. Yeniden eskiye, en fazla 50.
   - Kart: avatar, isim, mesaj, tarih, e-posta (varsa). Butonlar: Onayla / Onayı kaldır, Sil (onay ister).
   - Optimistic güncelleme; loading, empty, error durumları; giriş hatasında tek genel hata mesajı.
   - Yeni metinler `src/i18n/tr.json` ve `en.json` dosyalarına (ikisine de).
6. **Firebase SDK:** `src/lib/firebase.js` içine `auth` export edilir (`db` gibi, env eksikse `null`). Auth SDK sadece admin chunk'ıyla yüklenir.

## Uygulama adımları

1. `firestore.rules`: `isAdmin()`, `admins` koleksiyonu, admin okuma/güncelleme/silme kuralları.
2. `src/lib/firebase.js`: `getAuth` ile `auth` export.
3. `src/lib/admin.js`: `signIn(email, password, remember)`, `signOut`, `onAuthChange`, `fetchByStatus(approved)`, `setApproved(id, bool)`, `deleteComment(id)`, `fetchPrivateEmail(id)`.
4. `src/pages/AdminPage.jsx` (+ gerekirse küçük bileşenler): giriş formu, sekmeler, kartlar, durumlar.
5. `src/App.jsx`: route + `pageLoaders.admin`, prefetch dışı; `VisitorTracker` hariç tutma.
6. i18n anahtarları (tr + en).
7. Kontroller: `npm run lint`, `npm run build`, tarayıcıda elle test.
8. `graphify update .`
9. Rules deploy (elle): `npx firebase-tools deploy --only firestore`

## Firebase Console'da yapılacaklar (bir kez)

1. Authentication → Sign-in method → **Email/Password** etkinleştir.
2. Authentication → Users → **Add user**: kendi e-postan + güçlü şifre. Oluşan **User UID**'i kopyala.
3. Firestore Database → **Start collection** → ID: `admins` → Document ID: kopyaladığın UID. Alan olarak herhangi biri (örn. `role` = `admin`; Firestore boş belge kabul etmez).
4. Rules yazıldıktan sonra deploy et (adım 9).
5. İsteğe bağlı: Authentication → Settings → "User actions" altında kayıt (signup) kapatma seçeneği varsa kapat; ayrıca Authentication → Settings → Authorized domains içinde `emre-tiryaki.github.io` ve `localhost` olsun.
