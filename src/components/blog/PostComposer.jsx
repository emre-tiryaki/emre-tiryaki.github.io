import useForm from '../../hooks/useForm';
import { useTranslation } from '../../hooks/translation';
import ImageUploader from './ImageUploader';
import FormField from '../ui/FormField';
import Button from '../ui/Button';

// Admin: gönderi oluştur / düzenle
// Not: parent (AdminPanel) bu bileşeni <PostComposer key={...}> ile mount eder,
// bu yüzden initial değer ilk render'da okunur (effect gerekmez).
// onSave(data, publish) — publish=true ise direkt yayınlanır, false ise taslak.
export default function PostComposer({ initial, onSave, onCancel, saving }) {
  const { t } = useTranslation();
  const c = t('blog.admin.composer');

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

  return (
    <div className="glass-card rounded-2xl" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1rem' }}>
        <FormField label={c.titleTr} name="titleTr" value={form.values.titleTr} onChange={form.setField} placeholder={c.titleTr} required error={form.errors.titleTr} />
        <FormField label={c.titleEn} name="titleEn" value={form.values.titleEn} onChange={form.setField} placeholder={c.titleEn} error={form.errors.titleEn} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '1rem' }}>
        <FormField label={c.bodyTr} name="bodyTr" as="textarea" rows={6} value={form.values.bodyTr} onChange={form.setField} placeholder={c.bodyTr} required error={form.errors.bodyTr} />
        <FormField label={c.bodyEn} name="bodyEn" as="textarea" rows={6} value={form.values.bodyEn} onChange={form.setField} placeholder={c.bodyEn} error={form.errors.bodyEn} />
      </div>

      <div>
        {form.errors.images && (
          <p style={{ fontSize: '0.72rem', color: '#fca5a5', marginBottom: '0.35rem' }}>{form.errors.images}</p>
        )}
        <ImageUploader images={form.values.images} onChange={(imgs) => form.setField('images', imgs)} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <Button variant="secondary" onClick={() => form.handleSubmit(undefined, false)} disabled={saving}>
          {saving === 'draft' ? c.publishing : c.saveDraft}
        </Button>
        <Button variant="primary" onClick={() => form.handleSubmit(undefined, true)} disabled={saving}>
          {saving === 'publish' ? c.publishing : (editing ? c.updatePublish : c.publishNow)}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          {c.cancel}
        </Button>
      </div>
    </div>
  );
}
