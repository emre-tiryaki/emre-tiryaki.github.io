import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import CommentForm from '../components/guestbook/CommentForm';
import CommentCard from '../components/guestbook/CommentCard';
import CommentOrbit from '../components/guestbook/CommentOrbit';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { useTranslation } from '../hooks/translation';
import { THEME_COLORS } from '../theme';
import {
  checkMine,
  createFallbackPicker,
  createScatter,
  fetchApproved,
  isGuestbookAvailable,
} from '../lib/guestbook';
import { cachedTranslations, translateComments } from '../lib/commentTranslate';

const TRANSLATE_PREF_KEY = 'guestbook-translate';
const readTranslatePref = () => {
  try {
    return localStorage.getItem(TRANSLATE_PREF_KEY) === '1';
  } catch {
    return false;
  }
};

/**
 * Kaydırılmayan sayfa: ortada buton, çevresinde yorumlar. Form ve yorum detayı modalda açılır.
 */
export default function GuestbookPage() {
  const { t, lang } = useTranslation();
  const [comments, setComments] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(isGuestbookAvailable);
  const [error, setError] = useState(false);
  const [composing, setComposing] = useState(false);
  const [opened, setOpened] = useState(null);
  const [notice, setNotice] = useState(false); // gönderim sonrası "manuel onaylanacak" uyarısı
  const [translateOn, setTranslateOn] = useState(readTranslatePref);
  const [translating, setTranslating] = useState(false);
  const [translateTick, setTranslateTick] = useState(0); // yeni çeviriler önbelleğe yazılınca yeniden çizer
  const pickFallback = useRef(createFallbackPicker());
  const scatter = useRef(createScatter());

  // Avatar ve konum seçimleri render dışında, veri geldiğinde yapılır
  const decorate = useCallback(
    (c) => ({ ...c, fallbackAvatar: c.avatar ? null : pickFallback.current(c.id ?? `${c.name}|${c.message}`), layout: scatter.current() }),
    [],
  );

  const load = useCallback(async ({ force = false } = {}) => {
    setLoading(true);
    setError(false);
    try {
      // Bekleyen yorumlar her girişte sunucuyla karşılaştırılır; onaylı liste 2 saatlik önbellekten gelir.
      // Kullanıcının bir yorumu yeni onaylandıysa önbellek atlanır ki yorum hemen listede görünsün.
      const { pending: mine, approvedCount } = await checkMine();
      const approved = await fetchApproved(20, { force: force || approvedCount > 0 });
      setPending(mine.map(decorate));
      setComments(approved.map(decorate));
    } catch (err) {
      console.error('guestbook load failed:', err?.code || err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [decorate]);

  useEffect(() => {
    if (isGuestbookAvailable) load();
  }, [load]);

  // Çeviri açıkken eksik çeviriler arka planda tamamlanır; dil değişince hedef dil de değişir
  useEffect(() => {
    if (!translateOn) return undefined;
    const all = [...pending, ...comments];
    const cached = cachedTranslations(all, lang);
    if (all.every((c) => cached[c.id])) return undefined;
    let alive = true;
    queueMicrotask(() => alive && setTranslating(true));
    translateComments(all, lang).finally(() => {
      if (!alive) return;
      setTranslating(false);
      setTranslateTick((n) => n + 1);
    });
    return () => {
      alive = false;
      setTranslating(false);
    };
  }, [translateOn, lang, pending, comments]);

  const toggleTranslate = () => {
    const next = !translateOn;
    setTranslateOn(next);
    try {
      localStorage.setItem(TRANSLATE_PREF_KEY, next ? '1' : '0');
    } catch {
      // tercih kaydedilemezse yalnızca bu oturumda geçerli
    }
  };

  // Gösterilen metin: çeviri varsa o, yoksa orijinal. Orijinal `original` alanında saklanır.
  const [shownPending, shownComments] = useMemo(() => {
    if (!translateOn) return [pending, comments];
    const map = cachedTranslations([...pending, ...comments], lang);
    const apply = (c) =>
      map[c.id]?.text ? { ...c, message: map[c.id].text, original: c.message, translatedFrom: map[c.id].source } : c;
    return [pending.map(apply), comments.map(apply)];
    // translateTick: önbellek modül içinde değişir, yeniden hesaplama için tetikleyici
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [translateOn, lang, pending, comments, translateTick]);
  const openedComment = opened && [...shownPending, ...shownComments].find((c) => c.id === opened);

  const handleSubmitted = (mine) => {
    setPending((p) => [decorate(mine), ...p]);
    setComposing(false);
    setNotice(true);
  };

  return (
    <PageLayout title={t('guestbook.title')} subtitle={t('guestbook.subtitle')} maxWidth="80rem" fullHeight>
      {isGuestbookAvailable ? (
        <CommentOrbit
          pending={shownPending}
          comments={shownComments}
          loading={loading}
          error={error}
          onRetry={() => load({ force: true })}
          onCompose={() => {
            setComposing(true);
          }}
          onOpen={(c) => setOpened(c.id)}
          translate={{ on: translateOn, busy: translating, onToggle: toggleTranslate }}
        />
      ) : (
        <p role="status" style={{ textAlign: 'center', color: THEME_COLORS.text.muted }}>
          {t('guestbook.unavailable')}
        </p>
      )}

      {composing && (
        <Modal title={t('guestbook.form.title')} onClose={() => setComposing(false)}>
          <CommentForm onSubmitted={handleSubmitted} />
        </Modal>
      )}

      {notice && (
        <Modal title={t('guestbook.notice.title')} onClose={() => setNotice(false)} maxWidth="26rem">
          <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', lineHeight: 1.6, color: THEME_COLORS.text.secondary }}>
            {t('guestbook.notice.body')}
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" data-autofocus onClick={() => setNotice(false)}>
              {t('guestbook.notice.ok')}
            </Button>
          </div>
        </Modal>
      )}

      {openedComment && (
        <Modal title={t('guestbook.detailTitle')} onClose={() => setOpened(null)} maxWidth="42rem" bare>
          <CommentCard large comment={openedComment} pending={pending.some((p) => p.id === opened)} />
        </Modal>
      )}
    </PageLayout>
  );
}
