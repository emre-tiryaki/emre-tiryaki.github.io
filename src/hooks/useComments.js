import { useState, useEffect } from 'react';
import {
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase/init';

// ── PUBLIC: onaylı yorumlar + 1-level yanıtlar ──
export function useApprovedComments(postId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(!db || !postId);

  useEffect(() => {
    if (!db || !postId) return;
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      where('status', '==', 'approved'),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      () => setLoading(false)
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
