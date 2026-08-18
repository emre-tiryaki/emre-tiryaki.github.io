import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/init';

// ── PUBLIC: yayınlanmış tüm gönderileri çek (liste) ──
export function usePublishedPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(!db);
  const [error, setError] = useState(db ? null : 'Firebase yapılandırılmamış');

  useEffect(() => {
    if (!db) return;
    const q = query(
      collection(db, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(
      q,
      (snap) => {
        setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  return { posts, loading, error };
}

// ── PUBLIC: tek gönderi (detay) ──
export function usePost(postId) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(!db || !postId);

  useEffect(() => {
    if (!db || !postId) return;
    let active = true;
    getDoc(doc(db, 'posts', postId)).then((d) => {
      if (!active) return;
      if (d.exists() && d.data().published) {
        setPost({ id: d.id, ...d.data() });
      } else {
        setPost(null);
      }
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [postId]);

  return { post, loading };
}

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
    await addDoc(collection(db, 'commentSecrets'), {
      email: email.trim(),
    }).then((s) =>
      // id'yi yorum id'siyle eşleştir
      updateDoc(doc(db, 'commentSecrets', s.id), { refId: ref.id })
    );
  }

  return ref.id;
}

// ═══════════════════════════════════════════════════════════════════════
// ADMIN İŞLEMLERİ (useAdminBlog hook'u — sadece admin tarafından çağrılır)
// ═══════════════════════════════════════════════════════════════════════

export function useAdminBlog() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(!!db);

  useEffect(() => {
    if (!db) return;
    let settled = 0;
    const done = () => {
      settled += 1;
      if (settled >= 2) setLoading(false);
    };
    const unsubPosts = onSnapshot(
      query(collection(db, 'posts'), orderBy('createdAt', 'desc')),
      (snap) => { setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); done(); }
    );
    const unsubComments = onSnapshot(
      query(collection(db, 'comments'), orderBy('createdAt', 'desc')),
      (snap) => { setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() }))); done(); }
    );
    return () => {
      unsubPosts();
      unsubComments();
    };
  }, []);

  const createPost = useCallback(async (data, publish = false) => {
    return addDoc(collection(db, 'posts'), {
      ...data,
      published: !!publish,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }, []);

  const updatePost = useCallback(async (id, data) => {
    return updateDoc(doc(db, 'posts', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }, []);

  const deletePost = useCallback(async (id) => {
    return deleteDoc(doc(db, 'posts', id));
  }, []);

  const publishPost = useCallback(async (id, published) => {
    return updateDoc(doc(db, 'posts', id), { published });
  }, []);

  const approveComment = useCallback(async (id, adminUid, approve) => {
    return updateDoc(doc(db, 'comments', id), {
      status: approve ? 'approved' : 'rejected',
      reviewedAt: serverTimestamp(),
      reviewedBy: adminUid,
    });
  }, []);

  const deleteComment = useCallback(async (id) => {
    return deleteDoc(doc(db, 'comments', id));
  }, []);

  return {
    posts,
    comments,
    loading,
    createPost,
    updatePost,
    deletePost,
    publishPost,
    approveComment,
    deleteComment,
  };
}

// ── ADMIN: bir gönderiye ait tüm yorumlar (onaylı + pending) ──
export function useAdminCommentsForPost(postId) {
  const [comments, setComments] = useState([]);
  useEffect(() => {
    if (!db || !postId) return;
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q, (snap) =>
      setComments(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return () => unsub();
  }, [postId]);
  return comments;
}

// ── ADMIN: yorumcu mailini gizli koleksiyondan çek ──
export async function fetchCommentEmail(commentId) {
  if (!db) return null;
  try {
    const q = query(collection(db, 'commentSecrets'), where('refId', '==', commentId));
    const snap = await getDocs(q);
    if (!snap.empty) return snap.docs[0].data().email;
  } catch {
    /* yok */
  }
  return null;
}
