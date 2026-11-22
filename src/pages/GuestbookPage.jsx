import { useCallback, useEffect, useRef, useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import CommentForm from '../components/guestbook/CommentForm';
import CommentCard from '../components/guestbook/CommentCard';
import CommentOrbit from '../components/guestbook/CommentOrbit';
import Modal from '../components/ui/Modal';
import { useTranslation } from '../hooks/translation';
import { THEME_COLORS } from '../theme';
import {
  checkMine,
  createFallbackPicker,
  createScatter,
  fetchApproved,
  isGuestbookAvailable,
} from '../lib/guestbook';

/**
 * Kaydırılmayan sayfa: ortada buton, çevresinde yorumlar. Form ve yorum detayı modalda açılır.
 */
export default function GuestbookPage() {
  const { t } = useTranslation();
  const [comments, setComments] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(isGuestbookAvailable);
  const [error, setError] = useState(false);
  const [composing, setComposing] = useState(false);
  const [opened, setOpened] = useState(null);
  const [thanks, setThanks] = useState(false);
  const pickFallback = useRef(createFallbackPicker());
  const scatter = useRef(createScatter());

  // Avatar ve konum seçimleri render dışında, veri geldiğinde yapılır
  const decorate = useCallback(
    (c) => ({ ...c, fallbackAvatar: c.avatar ? null : pickFallback.current(), layout: scatter.current() }),
    [],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      // Önce yerel kayıtlar sunucuyla karşılaştırılır (onaylananlar listeden düşer), sonra onaylı liste gelir
      const [mine, approved] = await Promise.all([checkMine(), fetchApproved(20)]);
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

  useEffect(() => {
    if (!thanks) return undefined;
    const id = setTimeout(() => setThanks(false), 6000);
    return () => clearTimeout(id);
  }, [thanks]);

  const handleSubmitted = (mine) => {
    setPending((p) => [decorate(mine), ...p]);
    setComposing(false);
    setThanks(true);
  };

  return (
    <PageLayout title={t('guestbook.title')} subtitle={t('guestbook.subtitle')} maxWidth="80rem" fullHeight>
      {isGuestbookAvailable ? (
        <CommentOrbit
          pending={pending}
          comments={comments}
          loading={loading}
          error={error}
          onRetry={load}
          onCompose={() => {
            setThanks(false);
            setComposing(true);
          }}
          onOpen={setOpened}
        />
      ) : (
        <p role="status" style={{ textAlign: 'center', color: THEME_COLORS.text.muted }}>
          {t('guestbook.unavailable')}
        </p>
      )}

      {/* Gönderim sonrası geri bildirim: sayfa kaymasın diye sahnenin altına sabit */}
      <div
        role="status"
        aria-live="polite"
        style={{
          position: 'fixed',
          left: '50%',
          bottom: 'max(1rem, env(safe-area-inset-bottom))',
          transform: 'translateX(-50%)',
          zIndex: 300,
          maxWidth: 'calc(100vw - 2rem)',
          textAlign: 'center',
          fontSize: '0.85rem',
          padding: thanks ? '0.6rem 1rem' : 0,
          borderRadius: '0.75rem',
          color: THEME_COLORS.status.successSoft,
          background: thanks ? 'rgba(10, 10, 10, 0.9)' : 'transparent',
          border: thanks ? `1px solid ${THEME_COLORS.status.successBorder}` : 'none',
        }}
      >
        {thanks && t('guestbook.success')}
      </div>

      {composing && (
        <Modal title={t('guestbook.form.title')} onClose={() => setComposing(false)}>
          <CommentForm onSubmitted={handleSubmitted} />
        </Modal>
      )}

      {opened && (
        <Modal title={t('guestbook.detailTitle')} onClose={() => setOpened(null)}>
          <CommentCard comment={opened} pending={pending.some((p) => p.id === opened.id)} />
        </Modal>
      )}
    </PageLayout>
  );
}
