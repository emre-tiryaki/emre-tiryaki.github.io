import { useCallback, useEffect, useRef, useState } from 'react';
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
  const [notice, setNotice] = useState(false); // gönderim sonrası "manuel onaylanacak" uyarısı
  const pickFallback = useRef(createFallbackPicker());
  const scatter = useRef(createScatter());

  // Avatar ve konum seçimleri render dışında, veri geldiğinde yapılır
  const decorate = useCallback(
    (c) => ({ ...c, fallbackAvatar: c.avatar ? null : pickFallback.current(c.id ?? `${c.name}|${c.message}`), layout: scatter.current() }),
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

  const handleSubmitted = (mine) => {
    setPending((p) => [decorate(mine), ...p]);
    setComposing(false);
    setNotice(true);
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
            setComposing(true);
          }}
          onOpen={setOpened}
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

      {opened && (
        <Modal title={t('guestbook.detailTitle')} onClose={() => setOpened(null)} maxWidth="56rem" bare>
          <CommentCard large comment={opened} pending={pending.some((p) => p.id === opened.id)} />
        </Modal>
      )}
    </PageLayout>
  );
}
