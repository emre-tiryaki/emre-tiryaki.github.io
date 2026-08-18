import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/init';
import { useTranslation } from '../../hooks/useTranslation';

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
      alert('Firebase Storage yapılandırılmamış');
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
            <button
              type="button"
              onClick={() => onChange(images.filter((_, idx) => idx !== i))}
              className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <label className="inline-block px-4 py-2 rounded-lg text-sm font-semibold text-orange-400 border border-orange-500/40 cursor-pointer hover:bg-orange-500/10">
        {uploading ? t('blog.admin.composer.uploading') : t('blog.admin.composer.addImages')}
        <input type="file" accept="image/*" multiple hidden onChange={handleFiles} disabled={uploading} />
      </label>
    </div>
  );
}
