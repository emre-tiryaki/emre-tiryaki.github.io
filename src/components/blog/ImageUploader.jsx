import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/init';
import { useTranslation } from '../../hooks/translation';
import Button from '../ui/Button';

// Admin'in Storage'a çoklu resim yüklemesi (max 4)
export default function ImageUploader({ images, onChange }) {
  const { t } = useTranslation();
  const [uploading, setUploading] = useState(false);

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    if (images.length + files.length > 4) {
      alert(t('blog.admin.composer.maxImages'));
      return;
    }
    if (!storage) {
      alert(t('blog.admin.storageNotConfigured'));
      return;
    }
    setUploading(true);
    try {
      const urls = await Promise.all(
        files.map(async (file) => {
          const path = `blog/tmp/${Date.now()}_${file.name}`;
          const r = ref(storage, path);
          await uploadBytes(r, file);
          return getDownloadURL(r);
        })
      );
      onChange([...images, ...urls].slice(0, 4));
    } catch (err) {
      alert(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <p className="text-xs text-neutral-400 mb-2">{t('blog.admin.composer.images')}</p>
      <div className="flex flex-wrap gap-2 mb-2">
        {images.map((src, i) => (
          <div key={i} className="relative" style={{ width: 80, height: 80 }}>
            <img src={src} alt="" className="w-full h-full object-cover rounded-lg" />
            <Button
              variant="danger"
              size="sm"
              onClick={() => onChange(images.filter((_, idx) => idx !== i))}
              style={{ position: 'absolute', top: -8, right: -8, width: 20, height: 20, padding: 0, borderRadius: '9999px', fontSize: '0.7rem' }}
              aria-label={t('blog.admin.removeImage')}
            >
              ×
            </Button>
          </div>
        ))}
      </div>
      <Button as="label" variant="secondary" size="sm" className="cursor-pointer">
        {uploading ? t('blog.admin.composer.uploading') : t('blog.admin.composer.addImages')}
        <input type="file" accept="image/*" multiple hidden onChange={handleFiles} disabled={uploading} />
      </Button>
    </div>
  );
}
