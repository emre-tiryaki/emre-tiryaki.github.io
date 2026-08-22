import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  query,
  orderBy,
  where,
  onSnapshot,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/init';

// ═══════════════════════════════════════════════════════════════════════
// ADMIN İŞLEMLERİ — sadece admin paneli tarafından çağrılır
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

  // Admin panelinden bir yoruma yanıt yazmak için (admin imzalı, doğrudan onaylı)
  const addComment = useCallback(async (data) => {
    if (!db) return null;
    const ref = await addDoc(collection(db, 'comments'), {
      authorName: data.authorName,
      authorEmail: data.authorEmail || null,
      content: data.content,
      postId: data.postId,
      parentId: data.parentId || null,
      status: data.status || 'pending',
      createdAt: serverTimestamp(),
    });
    // Admin yanıtının maili de gizli koleksiyonda olsun ki panelde görünsün
    if (data.authorEmail) {
      await addDoc(collection(db, 'commentSecrets'), {
        email: data.authorEmail,
        refId: ref.id,
      });
    }
    return ref;
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
    addComment,
  };
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
