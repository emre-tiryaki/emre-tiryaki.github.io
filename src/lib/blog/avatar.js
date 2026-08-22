// Profil fotoğrafı seçici. Hem post (Emre imzalı) hem yorum avatarlarında kullanılır.
//
// getPfp(email, id) kuralları:
//   • email yoksa                        → id ile hash'lenir → comment_pfps'ten (deterministik, re-render'da DEĞİŞMEZ)
//   • email === OWNER_EMAIL             → personal_photos'tan (Emre'nin kendi fotoğrafları)
//   • email var ama Emre değilse         → mail hash'lenir → comment_pfps'ten ilgili fotoğraf (deterministik)
// pickPhoto(id)                         → post kartlarında Emre imzalı avatar (personal_photos, deterministik)

const OWNER_EMAIL = 'tiryakiemre18@gmail.com';

const personalModules = import.meta.glob(
  '../../assets/personal_photos/*.{jpg,jpeg,png,JPG,JPEG,PNG}',
  { eager: true, import: 'default' }
);
const personalPhotos = Object.entries(personalModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

const pfpModules = import.meta.glob(
  '../../assets/comment_pfps/*.{jpg,jpeg,png,JPG,JPEG,PNG}',
  { eager: true, import: 'default' }
);
const commentPfps = Object.entries(pfpModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src);

function hashStr(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function pickPhoto(id = '') {
  if (!personalPhotos.length) return null;
  return personalPhotos[hashStr(id) % personalPhotos.length];
}

// id: yorumun stabil kimliği (comment.id). Mail yoksa bile avatar sabit kalsın diye kullanılır.
export function getPfp(email, id = '') {
  // Mail yok → id ile hash'le (deterministik: aynı yorum = aynı avatar, re-render'da değişmez)
  if (!email) {
    if (!commentPfps.length) return null;
    return commentPfps[hashStr('noid:' + id) % commentPfps.length];
  }
  // Emre'nin kendi maili → kendi fotoğraflarından (personal_photos)
  if (email.trim().toLowerCase() === OWNER_EMAIL) {
    return pickPhoto(email);
  }
  // Diğer mail → hash'lenip comment_pfps'ten ilgili fotoğraf
  if (!commentPfps.length) return null;
  return commentPfps[hashStr(email.toLowerCase()) % commentPfps.length];
}
