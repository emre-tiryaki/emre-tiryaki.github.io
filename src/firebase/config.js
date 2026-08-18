// ─────────────────────────────────────────────────────────────────────────────
// Firebase configuration — değerler .env dosyasından (VITE_FIREBASE_*) okunur.
//
// .env DOSYASINI REPO'YA PUSHLAMA (zaten .gitignore'da).
// Örnek .env yapısı:
//   VITE_FIREBASE_API_KEY=...
//   VITE_FIREBASE_AUTH_DOMAIN=...
//   VITE_FIREBASE_PROJECT_ID=...
//   VITE_FIREBASE_STORAGE_BUCKET=...
//   VITE_FIREBASE_MESSAGING_SENDER_ID=...
//   VITE_FIREBASE_APP_ID=...
//   VITE_FIREBASE_MEASUREMENT_ID=...
//
// NOT: Firebase web API anahtarı tarayıcıda HERKESçe okunabilir (normaldir).
// Güvenlik FIRESTORE / STORAGE SECURITY RULES ile sağlanır, anahtarla değil.
// .env kullanmamızın sebebi: key'i VERSION CONTROL'e sokmamak (good practice).
// ─────────────────────────────────────────────────────────────────────────────

const env = import.meta.env;

export const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Config dolu değilse uygulamanın çökmesini önle (kullanıcıya uyarı ver)
export const isFirebaseConfigured = () =>
  !!firebaseConfig.apiKey && !!firebaseConfig.projectId;
