import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
} from 'firebase/firestore';
import { db } from '../firebase/init';
import { readCache, writeCache, restoreTimestamps, serializeTimestamps } from '../lib/blog/cache';

// ── PUBLIC: yayınlanmış tüm gönderileri çek (liste) ──
export function usePublishedPosts() {
  const CACHE_KEY = 'blog_published_posts';
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(!!db);
  const [error, setError] = useState(db ? null : 'Firebase yapılandırılmamış');

  useEffect(() => {
    if (!db) return;

    // 1. Cache varsa hemen kullan (state güncellemesi efekt gövdesi dışına ertelendi)
    const cached = readCache(CACHE_KEY);
    if (cached) {
      queueMicrotask(() => {
        setPosts(restoreTimestamps(cached));
        setLoading(false);
      });
      return;
    }

    // 2. Cache miss → Firestore'dan çek
    const q = query(
      collection(db, 'posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );
    getDocs(q)
      .then((snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        const serializable = serializeTimestamps(data);
        writeCache(CACHE_KEY, serializable);
        setPosts(restoreTimestamps(serializable));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { posts, loading, error };
}

// ── PUBLIC: tek gönderi (detay) ──
export function usePost(postId) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(!!db && !!postId);

  useEffect(() => {
    if (!db || !postId) return;
    const CACHE_KEY = `blog_post_${postId}`;

    const cached = readCache(CACHE_KEY);
    if (cached) {
      queueMicrotask(() => {
        setPost(restoreTimestamps([cached])[0]);
        setLoading(false);
      });
      return;
    }

    let active = true;
    getDoc(doc(db, 'posts', postId)).then((d) => {
      if (!active) return;
      if (d.exists() && d.data().published) {
        const raw = { id: d.id, ...d.data() };
        const serializable = serializeTimestamps([raw])[0];
        writeCache(CACHE_KEY, serializable);
        setPost(restoreTimestamps([serializable])[0]);
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
