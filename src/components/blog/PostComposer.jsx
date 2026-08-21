import { useState } from 'react';
import { useTranslation } from '../../hooks/translation';
import ImageUploader from './ImageUploader';

// Admin: gönderi oluştur / düzenle
// Not: parent (AdminPanel) bu bileşeni <PostComposer key={...}> ile mount eder,
// bu yüzden initial değeri ilk render'da okunur (effect gerekmez).
// onSave(data, publish) — publish=true ise direkt yayınlanır, false ise taslak.
export default function PostComposer({ initial, onSave, onCancel, saving }) {
  const { t } = useTranslation();
  const c = t('blog.admin.composer');
  const [titleTr, setTitleTr] = useState(initial?.title?.tr || '');
  const [titleEn, setTitleEn] = useState(initial?.title?.en || '');
  const [bodyTr, setBodyTr] = useState(initial?.body?.tr || '');
  const [bodyEn, setBodyEn] = useState(initial?.body?.en || '');
  const [images, setImages] = useState(initial?.images || []);

  function collectData() {
    return {
      title: { tr: titleTr, en: titleEn },
      body: { tr: bodyTr, en: bodyEn },
      images,
    };
  }

  async function handleSave(publish) {
    await onSave(collectData(), publish);
  }

  const editing = !!(initial && initial.id);

  return (
    <div className="glass-card rounded-2xl p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input value={titleTr} onChange={(e) => setTitleTr(e.target.value)} placeholder={c.titleTr}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-neutral-100 outline-none focus:border-orange-500/50" />
        <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} placeholder={c.titleEn}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-neutral-100 outline-none focus:border-orange-500/50" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <textarea value={bodyTr} onChange={(e) => setBodyTr(e.target.value)} placeholder={c.bodyTr} rows={5}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-neutral-100 outline-none focus:border-orange-500/50 resize-none" />
        <textarea value={bodyEn} onChange={(e) => setBodyEn(e.target.value)} placeholder={c.bodyEn} rows={5}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-neutral-100 outline-none focus:border-orange-500/50 resize-none" />
      </div>
      <ImageUploader images={images} onChange={setImages} />

      <div className="flex flex-wrap gap-2">
        {/* Taslağa kaydet (hem yeni hem düzenleme için) */}
        <button onClick={() => handleSave(false)} disabled={saving}
          className="px-5 py-2 rounded-lg text-sm font-bold text-neutral-100 border border-white/15 hover:bg-white/5"
          style={{ opacity: saving ? 0.6 : 1 }}>
          {saving === 'draft' ? c.publishing : c.saveDraft}
        </button>

        {/* Direkt yayınla */}
        <button onClick={() => handleSave(true)} disabled={saving}
          className="px-5 py-2 rounded-lg text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg,#f97316,#f59e0b)', opacity: saving ? 0.6 : 1 }}>
          {saving === 'publish' ? c.publishing : (editing ? c.updatePublish : c.publishNow)}
        </button>

        <button onClick={onCancel}
          className="px-5 py-2 rounded-lg text-sm font-semibold text-neutral-300 border border-white/15 hover:bg-white/5">
          {c.cancel}
        </button>
      </div>
    </div>
  );
}
