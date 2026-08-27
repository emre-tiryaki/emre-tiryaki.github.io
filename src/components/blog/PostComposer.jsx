import { useState } from 'react';
import useForm from '../../hooks/useForm';
import { useTranslation } from '../../hooks/translation';
import ImageUploader from './ImageUploader';
import ImageCarousel from './ImageCarousel';
import FormField from '../ui/FormField';
import Button from '../ui/Button';
import { VerifiedIcon } from '../ui/icons';
import { pickPhoto } from '../../lib/blog/avatar';
import { translateText } from '../../lib/translate';
import {
  FiEye,
  FiLayout,
  FiFileText,
  FiUpload,
  FiSave,
  FiX,
  FiCheck,
  FiZap,
} from 'react-icons/fi';

function readingTime(text = '') {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export default function PostComposer({ initial, onSave, onCancel, saving }) {
  const { t, lang: currentLang } = useTranslation();
  const c = t('blog.admin.composer');
  const a = t('blog.admin');

  const [activeLang, setActiveLang] = useState('tr'); // 'tr' | 'en' (which language to edit)
  const [previewLang, setPreviewLang] = useState(currentLang || 'tr'); // 'tr' | 'en'
  const [previewMode, setPreviewMode] = useState('detail'); // 'detail' | 'card'

  const [translating, setTranslating] = useState(false);
  const [translateSuccess, setTranslateSuccess] = useState(false);

  const form = useForm({
    initial: {
      titleTr: initial?.title?.tr || '',
      titleEn: initial?.title?.en || '',
      bodyTr: initial?.body?.tr || '',
      bodyEn: initial?.body?.en || '',
      images: initial?.images || [],
    },
    validate: (v) => {
      const e = {};
      if (!v.titleTr.trim()) e.titleTr = c.required;
      if (!v.bodyTr.trim()) e.bodyTr = c.required;
      if (v.images.length > 4) e.images = c.maxImages;
      return e;
    },
    onSubmit: async (v, publish) => {
      await onSave(
        {
          title: { tr: v.titleTr, en: v.titleEn },
          body: { tr: v.bodyTr, en: v.bodyEn },
          images: v.images,
        },
        publish
      );
    },
  });

  const editing = !!(initial && initial.id);
  const avatar = pickPhoto(initial?.id || 'new');

  const isTr = activeLang === 'tr';
  const sourceTitle = isTr ? form.values.titleTr : form.values.titleEn;
  const sourceBody = isTr ? form.values.bodyTr : form.values.bodyEn;
  const fromLang = isTr ? 'tr' : 'en';
  const toLang = isTr ? 'en' : 'tr';

  // İki Yönlü Otomatik Çeviri (TR -> EN veya EN -> TR)
  async function handleAutoTranslate() {
    if (translating) return;
    if (!sourceTitle && !sourceBody) return;

    setTranslating(true);
    setTranslateSuccess(false);

    try {
      const [transTitle, transBody] = await Promise.all([
        sourceTitle ? translateText(sourceTitle, fromLang, toLang) : Promise.resolve(''),
        sourceBody ? translateText(sourceBody, fromLang, toLang) : Promise.resolve(''),
      ]);

      if (isTr) {
        if (transTitle) form.setField('titleEn', transTitle);
        if (transBody) form.setField('bodyEn', transBody);
        setPreviewLang('en');
      } else {
        if (transTitle) form.setField('titleTr', transTitle);
        if (transBody) form.setField('bodyTr', transBody);
        setPreviewLang('tr');
      }

      setTranslateSuccess(true);
      setTimeout(() => setTranslateSuccess(false), 3500);
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setTranslating(false);
    }
  }

  // Preview values
  const previewTitle = (previewLang === 'tr' ? form.values.titleTr : form.values.titleEn) ||
                       (previewLang === 'tr' ? form.values.titleEn : form.values.titleTr) || '';
  const previewBody = (previewLang === 'tr' ? form.values.bodyTr : form.values.bodyEn) ||
                      (previewLang === 'tr' ? form.values.bodyEn : form.values.bodyTr) || '';
  const previewImages = form.values.images || [];
  const mins = readingTime(previewBody);
  const excerpt = previewBody.replace(/[#*>`_\n]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180);

  const wordCount = (activeLang === 'tr' ? form.values.bodyTr : form.values.bodyEn).trim().split(/\s+/).filter(Boolean).length;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 1.15fr) minmax(320px, 1fr)',
        gap: '1.5rem',
        width: '100%',
        alignItems: 'stretch',
      }}
      className="composer-grid"
    >
      {/* ── LEFT PANE: Editor Form ── */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.035)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '1rem',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxSizing: 'border-box',
        }}
      >
        {/* Editor Top Bar: Title + Language Switcher + Auto Translate Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#f8fafc' }}>
              {editing ? a.editPost : a.newPost}
            </span>
            {editing && initial?.published && (
              <span style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', borderRadius: '999px', background: 'rgba(34,197,94,0.15)', color: '#4ade80', fontWeight: 700 }}>
                {a.published}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* Dynamic Bidirectional Auto Translate Button */}
            <button
              type="button"
              onClick={handleAutoTranslate}
              disabled={translating || (!sourceTitle && !sourceBody)}
              title={isTr ? c.autoTranslateTooltipTr : c.autoTranslateTooltipEn}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.32rem 0.7rem',
                borderRadius: '0.65rem',
                border: '1px solid',
                borderColor: translateSuccess ? 'rgba(34, 197, 94, 0.45)' : 'rgba(249, 115, 22, 0.35)',
                background: translateSuccess ? 'rgba(34, 197, 94, 0.15)' : 'rgba(249, 115, 22, 0.12)',
                color: translateSuccess ? '#4ade80' : '#fb923c',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: translating ? 'wait' : (!sourceTitle && !sourceBody ? 'not-allowed' : 'pointer'),
                opacity: (!sourceTitle && !sourceBody) ? 0.55 : 1,
                transition: 'all 0.18s ease',
                boxShadow: translateSuccess ? '0 0 12px rgba(34, 197, 94, 0.2)' : '0 0 10px rgba(249, 115, 22, 0.1)',
              }}
              onMouseEnter={(e) => {
                if (!translating && (sourceTitle || sourceBody)) {
                  e.currentTarget.style.background = translateSuccess ? 'rgba(34, 197, 94, 0.22)' : 'rgba(249, 115, 22, 0.22)';
                }
              }}
              onMouseLeave={(e) => {
                if (!translating) {
                  e.currentTarget.style.background = translateSuccess ? 'rgba(34, 197, 94, 0.15)' : 'rgba(249, 115, 22, 0.12)';
                }
              }}
            >
              {translating ? (
                <>
                  <span className="inline-block animate-spin" style={{ display: 'inline-block' }}>⚙️</span>
                  <span>{c.translating}</span>
                </>
              ) : translateSuccess ? (
                <>
                  <FiCheck size={14} />
                  <span>{isTr ? c.translatedToEn : c.translatedToTr}</span>
                </>
              ) : (
                <>
                  <FiZap size={14} />
                  <span>{c.autoTranslate} ({isTr ? 'TR → EN' : 'EN → TR'})</span>
                </>
              )}
            </button>

            {/* Language Switcher for editing */}
            <div style={{ display: 'flex', gap: '0.35rem', background: 'rgba(0,0,0,0.3)', padding: '0.2rem', borderRadius: '0.65rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                type="button"
                onClick={() => setActiveLang('tr')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: activeLang === 'tr' ? 'rgba(249, 115, 22, 0.2)' : 'transparent',
                  color: activeLang === 'tr' ? '#fb923c' : '#94a3b8',
                  fontSize: '0.75rem',
                  fontWeight: activeLang === 'tr' ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>🇹🇷</span>
                <span>Türkçe</span>
                {form.values.titleTr && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#fb923c' }} />}
              </button>
              <button
                type="button"
                onClick={() => setActiveLang('en')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.3rem 0.65rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: activeLang === 'en' ? 'rgba(249, 115, 22, 0.2)' : 'transparent',
                  color: activeLang === 'en' ? '#fb923c' : '#94a3b8',
                  fontSize: '0.75rem',
                  fontWeight: activeLang === 'en' ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>🇬🇧</span>
                <span>English</span>
                {form.values.titleEn && <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4ade80' }} />}
              </button>
            </div>
          </div>
        </div>

        {/* Title Input (Language dependent) */}
        {activeLang === 'tr' ? (
          <FormField
            label={c.titleTr}
            name="titleTr"
            value={form.values.titleTr}
            onChange={form.setField}
            placeholder={c.titleTr}
            required
            error={form.errors.titleTr}
          />
        ) : (
          <FormField
            label={c.titleEn}
            name="titleEn"
            value={form.values.titleEn}
            onChange={form.setField}
            placeholder={c.titleEn}
            error={form.errors.titleEn}
          />
        )}

        {/* Body Textarea (Language dependent) */}
        <div>
          {activeLang === 'tr' ? (
            <FormField
              label={c.bodyTr}
              name="bodyTr"
              as="textarea"
              rows={8}
              value={form.values.bodyTr}
              onChange={form.setField}
              placeholder={c.bodyTr}
              required
              error={form.errors.bodyTr}
            />
          ) : (
            <FormField
              label={c.bodyEn}
              name="bodyEn"
              as="textarea"
              rows={8}
              value={form.values.bodyEn}
              onChange={form.setField}
              placeholder={c.bodyEn}
              error={form.errors.bodyEn}
            />
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.35rem' }}>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>
              {c.wordsCount ? c.wordsCount.replace('{n}', wordCount) : `${wordCount} words`}
            </span>
          </div>
        </div>

        {/* Image Uploader */}
        <div>
          {form.errors.images && (
            <p style={{ fontSize: '0.72rem', color: '#fca5a5', marginBottom: '0.35rem' }}>{form.errors.images}</p>
          )}
          <ImageUploader images={form.values.images} onChange={(imgs) => form.setField('images', imgs)} />
        </div>

        {/* Form Actions */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '0.65rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            marginTop: 'auto',
          }}
        >
          <Button variant="secondary" onClick={() => form.handleSubmit(undefined, false)} disabled={saving}>
            <FiSave size={14} style={{ marginRight: '0.3rem' }} />
            {saving === 'draft' ? c.publishing : c.saveDraft}
          </Button>

          <Button variant="primary" onClick={() => form.handleSubmit(undefined, true)} disabled={saving}>
            <FiUpload size={14} style={{ marginRight: '0.3rem' }} />
            {saving === 'publish' ? c.publishing : (editing ? c.updatePublish : c.publishNow)}
          </Button>

          <Button variant="ghost" onClick={onCancel}>
            <FiX size={14} style={{ marginRight: '0.2rem' }} />
            {c.cancel}
          </Button>
        </div>
      </div>

      {/* ── RIGHT PANE: Live Preview ── */}
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.035)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '1rem',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxSizing: 'border-box',
        }}
      >
        {/* Preview Header & Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <FiEye size={16} style={{ color: '#fb923c' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
              {a.livePreview}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* View Mode Toggle */}
            <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(0,0,0,0.3)', padding: '0.2rem', borderRadius: '0.65rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                type="button"
                onClick={() => setPreviewMode('detail')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.25rem 0.55rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: previewMode === 'detail' ? 'rgba(249, 115, 22, 0.2)' : 'transparent',
                  color: previewMode === 'detail' ? '#fb923c' : '#94a3b8',
                  fontSize: '0.72rem',
                  fontWeight: previewMode === 'detail' ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                <FiFileText size={12} />
                <span>{a.previewDetail}</span>
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('card')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.25rem 0.55rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: previewMode === 'card' ? 'rgba(249, 115, 22, 0.2)' : 'transparent',
                  color: previewMode === 'card' ? '#fb923c' : '#94a3b8',
                  fontSize: '0.72rem',
                  fontWeight: previewMode === 'card' ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                <FiLayout size={12} />
                <span>{a.previewCard}</span>
              </button>
            </div>

            {/* Preview Language Toggle */}
            <div style={{ display: 'flex', gap: '0.25rem', background: 'rgba(0,0,0,0.3)', padding: '0.2rem', borderRadius: '0.65rem', border: '1px solid rgba(255,255,255,0.06)' }}>
              <button
                type="button"
                onClick={() => setPreviewLang('tr')}
                style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: previewLang === 'tr' ? 'rgba(249, 115, 22, 0.2)' : 'transparent',
                  color: previewLang === 'tr' ? '#fb923c' : '#94a3b8',
                  fontSize: '0.72rem',
                  fontWeight: previewLang === 'tr' ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                TR
              </button>
              <button
                type="button"
                onClick={() => setPreviewLang('en')}
                style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.5rem',
                  border: 'none',
                  background: previewLang === 'en' ? 'rgba(249, 115, 22, 0.2)' : 'transparent',
                  color: previewLang === 'en' ? '#fb923c' : '#94a3b8',
                  fontSize: '0.72rem',
                  fontWeight: previewLang === 'en' ? 700 : 500,
                  cursor: 'pointer',
                }}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Preview Container */}
        <div
          style={{
            flex: 1,
            minHeight: '340px',
            borderRadius: '0.85rem',
            border: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(0, 0, 0, 0.25)',
            padding: '1.25rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Author Tweet-style Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img
              src={avatar}
              alt="Emre Tiryaki"
              width={42}
              height={42}
              style={{
                width: '2.65rem',
                height: '2.65rem',
                borderRadius: '50%',
                objectFit: 'cover',
                objectPosition: 'top',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', lineHeight: 1.2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                  Emre Tiryaki
                </span>
                <VerifiedIcon style={{ width: '1rem', height: '1rem', color: '#0ea5e9' }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {t('blog.today')} · {t('blog.readTime', { n: mins })}
              </span>
            </div>
          </div>

          {/* ── Mode 1: Detail Page View ── */}
          {previewMode === 'detail' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Title */}
              <h2
                style={{
                  fontSize: '1.45rem',
                  fontWeight: 800,
                  color: previewTitle ? '#f8fafc' : '#64748b',
                  lineHeight: 1.35,
                  margin: 0,
                  letterSpacing: '-0.015em',
                }}
              >
                {previewTitle || a.previewPlaceholderTitle}
              </h2>

              {/* Body Content */}
              <div
                style={{
                  fontSize: '0.925rem',
                  color: previewBody ? '#cbd5e1' : '#64748b',
                  lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  fontStyle: previewBody ? 'normal' : 'italic',
                }}
              >
                {previewBody || a.previewPlaceholderBody}
              </div>

              {/* Uploaded Images Carousel Preview */}
              {previewImages.length > 0 && (
                <div style={{ marginTop: '0.5rem' }}>
                  <ImageCarousel images={previewImages} height={260} />
                </div>
              )}
            </div>
          ) : (
            /* ── Mode 2: List Card View ── */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: previewTitle ? '#f8fafc' : '#64748b',
                  lineHeight: 1.3,
                  margin: 0,
                }}
              >
                {previewTitle || a.previewPlaceholderTitle}
              </h3>

              <p
                style={{
                  fontSize: '0.875rem',
                  color: previewBody ? '#94a3b8' : '#64748b',
                  lineHeight: 1.6,
                  margin: 0,
                  fontStyle: previewBody ? 'normal' : 'italic',
                }}
              >
                {excerpt || a.previewPlaceholderBody}
                {previewBody.length > 180 ? '…' : ''}
              </p>

              {previewImages.length > 0 && (
                <div style={{ marginTop: '0.25rem' }}>
                  <ImageCarousel images={previewImages} height={200} />
                </div>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '0.65rem',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  marginTop: '0.25rem',
                }}
              >
                <span style={{ fontSize: '0.72rem', color: '#64748b' }}>
                  {t('blog.readTime', { n: mins })}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fb923c' }}>
                  {t('blog.readMore')} →
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
