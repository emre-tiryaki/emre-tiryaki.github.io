// Post kartı ve detay sayfasında ortak kullanılan tarih biçimleyici.
// Firestore Timestamp (createdAt.toDate()) veya null kabul eder.

export function formatPostDate(createdAt, lang = 'en') {
  if (!createdAt?.toDate) return '';
  return createdAt.toDate().toLocaleDateString(
    lang === 'tr' ? 'tr-TR' : 'en-US',
    { day: 'numeric', month: lang === 'tr' ? 'short' : 'long', year: 'numeric' }
  );
}
