// Twitter benzeri 1-4 resim grid düzeni
export default function ImageGrid({ images = [], rounded = '1rem' }) {
  if (!images.length) return null;

  const n = Math.min(images.length, 4);
  const layout = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-2', // 3. resim alt satırda tek geniş
    4: 'grid-cols-2',
  }[n];

  return (
    <div className={`grid ${layout} gap-1.5 overflow-hidden`} style={{ borderRadius: rounded }}>
      {images.slice(0, 4).map((src, i) => (
        <div
          key={i}
          className={n === 3 && i === 0 ? 'col-span-2' : ''}
          style={{ aspectRatio: n === 1 ? '16 / 9' : '1 / 1' }}
        >
          <img
            src={src}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover"
            style={{ display: 'block' }}
          />
        </div>
      ))}
    </div>
  );
}
