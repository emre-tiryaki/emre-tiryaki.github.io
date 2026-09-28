import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig, isFirebaseConfigured } from './config';

// Config dolu değilse app'i başlatma (crash önleme) — çağıran yerler kontrol eder
let app = null;
let auth = null;
let db = null;
let storage = null;

if (isFirebaseConfigured()) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Analytics yalnızca tarayıcıda ve measurementId varsa
  if (typeof window !== 'undefined' && firebaseConfig.measurementId) {
    import('firebase/analytics')
      .then(({ getAnalytics, logEvent }) => {
        const analytics = getAnalytics(app);
        logEvent(analytics, 'app_initialized');
      })
      .catch(() => {
        /* analytics opsiyonel, hata yok sayılır */
      });
  }
}

export { app, auth, db, storage, isFirebaseConfigured };
