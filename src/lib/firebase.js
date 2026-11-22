import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Yapılandırma build-time env'den gelir. Eksikse db = null olur ve sayfa formu gizler.
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isConfigured = Boolean(config.apiKey && config.projectId && config.appId);

export const db = isConfigured ? getFirestore(initializeApp(config)) : null;
