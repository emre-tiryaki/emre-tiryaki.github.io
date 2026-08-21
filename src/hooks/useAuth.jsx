import { useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/init';
import { AuthContext } from './auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Firebase user (admin)
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(!!auth);

  useEffect(() => {
    // Firebase yapılandırılmamışsa hemen çık
    if (!auth) {
      return;
    }

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // UID'yi config/admins listesinde ara
        try {
          const cfg = await getDoc(doc(db, 'config', 'admins'));
          const uids = cfg.exists() ? cfg.data().uids || [] : [];
          setIsAdmin(uids.includes(u.uid));
        } catch (err) {
          console.error('admin kontrol hatası:', err);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const login = useCallback(async (email, password) => {
    if (!auth) throw new Error('Firebase yapılandırılmamış');
    const cred = await signInWithEmailAndPassword(auth, email, password);
    // isAdmin durumu onAuthStateChanged tarafından güncellenir
    return cred;
  }, []);

  const logout = useCallback(async () => {
    if (!auth) return;
    await signOut(auth);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
