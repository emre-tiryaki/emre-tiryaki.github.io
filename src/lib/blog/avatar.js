// Post kartı ve detay sayfasında ortak kullanılan profil fotoğrafı seçici.
// Aynı hash mantığıyla bir post id'sinden deterministik fotoç çözer.

const photoModules = import.meta.glob(
  '../../assets/personal_photos/*.{jpg,jpeg,png,JPG,JPEG,PNG}',
  { eager: true, import: 'default' }
);

const photos = Object.entries(photoModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

export function pickPhoto(id = '') {
  if (!photos.length) return null;
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return photos[hash % photos.length];
}
