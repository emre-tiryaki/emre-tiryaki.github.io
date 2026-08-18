// ─────────────────────────────────────────────────────────────────────────────
// Firebase configuration
//
// BU DOSYAYI DOLDURMAN GEREKİYOR (bkz. FIREBASE_SETUP.md rehberi):
//   1. https://console.firebase.google.com → proje oluştur
//   2. Project settings → Your apps → Web app (</>) ekle
//   3. Aşağıdaki firebaseConfig objesini yapıştır
//
// NOT: Firebase web API anahtarı HERKESçe tarayıcıda okunabilir (normaldir).
// Güvenlik FIRESTORE/STORAGE SECURITY RULES ile sağlanır, anahtarla değil.
// Bu dosyayı .gitignore'a EKLEME (deploy'da gerekiyor) ama anahtarı public'tir.
// ─────────────────────────────────────────────────────────────────────────────

export const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Config henüz doldurulmadıysa uygulamanın çökmesini önle (kullanıcıya uyarı ver)
export const isFirebaseConfigured = () =>
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "YOUR_PROJECT_ID";
