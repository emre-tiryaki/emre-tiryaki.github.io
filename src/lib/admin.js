import {
  browserLocalPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
} from 'firebase/auth';
import { collection, deleteDoc, doc, getDoc, getDocs, limit as limitTo, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { auth, db } from './firebase';
import { isSafeAvatar } from './guestbook';

export const isAdminAvailable = Boolean(auth && db);

/** "Beni hatırla" işaretliyse oturum Çıkış'a kadar, değilse sekme kapanana kadar sürer. */
export async function signIn(email, password, remember) {
  await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
  await signInWithEmailAndPassword(auth, email, password);
}

export const signOut = () => fbSignOut(auth);

export const onAuthChange = (cb) => onAuthStateChanged(auth, cb);

/** approved durumuna göre yorumlar, yeniden eskiye. Yetki yoksa Firestore permission-denied atar. */
export async function fetchByStatus(approved, max = 50) {
  const q = query(
    collection(db, 'guestbook'),
    where('approved', '==', approved),
    orderBy('createdAt', 'desc'),
    limitTo(max),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => {
    const data = d.data();
    return {
      id: d.id,
      name: data.name,
      message: data.message,
      avatar: isSafeAvatar(data.avatar) ? data.avatar : null,
      createdAt: data.createdAt?.toMillis?.() ?? null,
    };
  });
}

export const setApproved = (id, approved) => updateDoc(doc(db, 'guestbook', id), { approved });

/** Yorum ve (varsa) e-posta belgesi silinir; e-posta belgesi yoksa deleteDoc sessizce geçer. */
export async function deleteComment(id) {
  await deleteDoc(doc(db, 'guestbook', id));
  await deleteDoc(doc(db, 'guestbookPrivate', id)).catch(() => {});
}

export async function fetchPrivateEmail(id) {
  try {
    const snap = await getDoc(doc(db, 'guestbookPrivate', id));
    return snap.exists() ? snap.data().email ?? null : null;
  } catch {
    return null;
  }
}
