import { useCallback, useEffect, useRef, useState } from 'react';
import PageLayout from '../components/layout/PageLayout';
import CommentForm from '../components/guestbook/CommentForm';
import CommentList from '../components/guestbook/CommentList';
import { useTranslation } from '../hooks/translation';
import { THEME_COLORS } from '../theme';
import { checkMine, createFallbackPicker, fetchApproved, isGuestbookAvailable } from '../lib/guestbook';

export default function GuestbookPage() {
  const { t } = useTranslation();
  const [comments, setComments] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(isGuestbookAvailable);
  const [error, setError] = useState(false);
  const pickFallback = useRef(createFallbackPicker());

  const withFallback = useCallback((c) => ({ ...c, fallbackAvatar: c.avatar ? null : pickFallback.current() }), []);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      // Önce yerel kayıtlar sunucuyla karşılaştırılır (onaylananlar listeden düşer), sonra onaylı liste gelir
      const [mine, approved] = await Promise.all([checkMine(), fetchApproved(20)]);
      setPending(mine.map(withFallback));
      setComments(approved.map(withFallback));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [withFallback]);

  useEffect(() => {
    if (isGuestbookAvailable) load();
  }, [load]);

  return (
    <PageLayout title={t('guestbook.title')} subtitle={t('guestbook.subtitle')} maxWidth="48rem">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {isGuestbookAvailable ? (
          <>
            <CommentForm onSubmitted={(mine) => setPending((p) => [withFallback(mine), ...p])} />
            <CommentList pending={pending} comments={comments} loading={loading} error={error} onRetry={load} />
          </>
        ) : (
          <p role="status" style={{ textAlign: 'center', color: THEME_COLORS.text.muted }}>
            {t('guestbook.unavailable')}
          </p>
        )}
      </div>
    </PageLayout>
  );
}
