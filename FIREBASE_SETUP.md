# Firebase Kurulum Rehberi (Blog Özelliği)

Bu rehber, blog özelliğinin çalışması için Firebase'i kurmanı adım adım anlatır.
Tüm kod dosyaları hazır — sadece Firebase konsolundan birkaç ayar yapıp
config dosyasını dolduracaksın.

---

## 1. Firebase projesi oluştur

1. https://console.firebase.google.com adresine git (Google hesabınla)
2. **"Add project"** → proje adı ver (ör. `emre-tiryaki-blog`)
3. Google Analytics'i istersen aç, istersen atla
4. Proje hazır olunca aç

## 2. Authentication (admin girişi) aç

1. Sol menü → **Authentication** → **Get started**
2. **Sign-in method** sekmesi → **Email/Password** → etkinleştir (diğerlerini değil)
3. **Users** sekmesi → **Add user**
   - E-posta: `admin@senin.site` (istediğin)
   - Şifre: güçlü bir şifre
   - Bu kullanıcının **UID'ini kopyala** (Users listesinde, sonra admins doc'a yazacağız)

## 3. Firestore Database oluştur

1. Sol menü → **Firestore Database** → **Create database**
2. **Production mode** → bölge: `europe-west (Belgium)` (bize yakın)
3. Hazır olunca **Rules** sekmesine git

### Firestore Rules'ı yapıştır

`firestore.rules` dosyasının içeriğini kopyala ve Firebase konsolundaki
Rules editörüne yapıştır → **Publish** et.

> Kural özeti: halk yayınlanmış postları + onaylı yorumları okur; herkes
> (girişsiz) pending yorum bırakabilir; sadece `config/admins` listesindeki
> UID'ler yazabilir/siler/onaylar. Yorumcu maili ayrı, gizli
> `commentSecrets` koleksiyonundadır (halka açık değildir).

### config/admins doc'unu oluştur

1. Firestore'da **Data** sekmesi → **Add collection**
   - Collection ID: `config`
   - Document ID: `admins`
   - Alan: `uids` (type: array) → değeri: `["<2. adımdaki UID>"]`
2. **Save**

## 4. Storage (resimler) oluştur

1. Sol menü → **Storage** → **Get started** → bölge aynı (europe-west)
2. **Rules** sekmesi → `storage.rules` dosyasının içeriğini yapıştır → **Publish**

## 5. Web app config'ini projeye koy

1. Proje ayarları (⚙) → **Your apps** → **Web (</>)** → app ekle
2. Firebase config objesini kopyala
3. Aç: `src/firebase/config.js`
4. `firebaseConfig` içindeki yer tutucuları (YOUR_API_KEY vb.) kendi
   değerlerinle değiştir, dosyayı kaydet

> NOT: Firebase web API anahtarı TARAYICIDA HERKESE AÇIKTR (normaldir).
> Güvenlik RULES ile sağlanır, anahtarı gizli tutmaya gerek yok.

## 6. Test et

```bash
npm run dev
```

- `/blog` → boş liste (henüz post yok)
- `/admin` → e-posta+şifre ile gir → **Yeni Yazı** → başlık/body (TR+EN) +
  en fazla 4 resim → kaydet → **Yayınla**
- `/blog` → yazın görünür
- Bir yazıya gir, yorum yap (ad + opsiyonel mail) → "incelenecek" uyarısı
- `/admin` → Yorumlar → **Onayla** → yorum herkese açık olur

---

## Güvenlik notları

- Yorumcu mailleri `commentSecrets` koleksiyonunda, halka açık `comments`
  okumasında YOK. Sadece admin görür.
- 1-seviye yorum kısıtı: kurallarda `parentId`'si dolu bir yorumun,
  bağlı olduğu yorumun da `parentId`'sinin boş olması zorlanır.
- Spam: şu an otomatik koruma yok; tüm yorumlar admin onayından geçer.
- Mail otomasyonu (onayda otomatik mail) ŞİMDİLİK KAPALI — sonra Cloud
  Functions + SMTP ile eklenecek.
