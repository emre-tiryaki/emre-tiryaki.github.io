import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase/init';

// ── PUBLIC: onaylı yorumlar + 1-level yanıtlar ──
// NOT: Tek 'where(postId)' sorgusu kullanırız; status filtresi ve sıralama
// client-side yapılır. Böylece Firestore composite index (postId+status+
// createdAt) gereksinimi ortadan kalkar — index eksikse yorumlar sessizce
// boş dönüyordu.
export function useApprovedComments(postId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(!db || !postId);

  useEffect(() => {
    if (!db || !postId) return;
    const q = query(collection(db, 'comments'), where('postId', '==', postId));
    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .filter((c) => c.status === 'approved')
          .sort((a, b) => {
            const ta = a.createdAt?.seconds || 0;
            const tb = b.createdAt?.seconds || 0;
            return ta - tb;
          });
        setComments(list);
        setLoading(false);
      },
      (e) => {
        console.error('Yorumlar yüklenemedi:', e);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [postId]);

  return { comments, loading };
}

// ── PUBLIC: yorum gönder (pending) + opsiyonel mail (ayrı secret doc) ──
export async function submitComment({
  postId,
  parentId,
  authorName,
  content,
  email,
}) {
  if (!db) throw new Error('Firebase yapılandırılmamış');

  // 1) Ana yorum doc'u (mail HİÇ yazılmaz — gizlilik)
  const ref = await addDoc(collection(db, 'comments'), {
    postId,
    parentId: parentId || null,
    authorName: authorName.trim(),
    content: content.trim(),
    status: 'pending',
    createdAt: serverTimestamp(),
    reviewedAt: null,
    reviewedBy: null,
  });

  // 2) Mail varsa ayrı, gizli commentSecrets koleksiyonuna
  if (email && email.trim()) {
    const secretRef = await addDoc(collection(db, 'commentSecrets'), { email: email.trim() });
    // id'yi yorum id'siyle eşleştir
    await updateDoc(doc(db, 'commentSecrets', secretRef.id), { refId: ref.id });
  }

  return ref.id;
}
