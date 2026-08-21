/**
 * Twitter benzeri resim grid düzeni — sabit 300px yükseklik
 *
 * 1 resim  → tam genişlik, 300px
 * 2 resim  → yan yana eşit, 300px
 * 3 resim  → sol büyük + sağda 2 küçük üst üste, 300px
 * 4 resim  → 2x2 grid, 300px
 */
export default function ImageGrid({ images = [], rounded = '0.75rem' }) {
  if (!images.length) return null;

  const n   = Math.min(images.length, 4);
  const h   = 300; // toplam container yüksekliği (px)
  const gap = 2;

  const imgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  };

  if (n === 1) {
    return (
      <div style={{ height: h, borderRadius: rounded, overflow: 'hidden' }}>
        <img src={images[0]} alt="" loading="lazy" style={imgStyle} />
      </div>
    );
  }

  if (n === 2) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap, height: h, borderRadius: rounded, overflow: 'hidden' }}>
        {images.slice(0, 2).map((src, i) => (
          <img key={i} src={src} alt="" loading="lazy" style={imgStyle} />
        ))}
      </div>
    );
  }

  if (n === 3) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap, height: h, borderRadius: rounded, overflow: 'hidden' }}>
        {/* Sol — tam yükseklik */}
        <img src={images[0]} alt="" loading="lazy" style={{ ...imgStyle, gridRow: 'span 2' }} />
        {/* Sağ üst */}
        <img src={images[1]} alt="" loading="lazy" style={imgStyle} />
        {/* Sağ alt */}
        <img src={images[2]} alt="" loading="lazy" style={imgStyle} />
      </div>
    );
  }

  // n === 4
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap, height: h, borderRadius: rounded, overflow: 'hidden' }}>
      {images.slice(0, 4).map((src, i) => (
        <img key={i} src={src} alt="" loading="lazy" style={imgStyle} />
      ))}
    </div>
  );
}
