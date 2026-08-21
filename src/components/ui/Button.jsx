// Proje genelinde kullanılan tek buton bileşeni.
// Tüm butonlar (navigasyon, form gönderimi, admin aksiyonları, ikincil/tehlike
// durumları) buradan geçer — tutarlı tasarım + kolay bakım.
//
// Kullanım:
//   <Button variant="primary" size="md" onClick={...}>Yayınla</Button>
//   <Button variant="danger" size="sm" disabled={busy}>Sil</Button>
//   <Button as="a" href="/blog/x" variant="secondary">Gör</Button>
//
// Stiller index.css'te `.btn` / `.btn--*` sınıflarıyla tanımlıdır (Tailwind
// --spacing bug'ından etkilenmemesi için saf CSS ile yazıldı).

const VARIANTS = ['primary', 'secondary', 'ghost', 'success', 'danger', 'warning', 'link'];
const SIZES = ['sm', 'md', 'lg'];

export default function Button({
  as,
  variant = 'secondary',
  size = 'md',
  className = '',
  type,
  children,
  ...props
}) {
  const Tag = as || 'button';

  const classes = [
    'btn',
    VARIANTS.includes(variant) ? `btn--${variant}` : 'btn--secondary',
    SIZES.includes(size) ? `btn--${size}` : 'btn--md',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // <button> olmayan elementlerde type anlamsız; sadece button'a ver.
  const extra = Tag === 'button' && type ? { type } : {};

  return (
    <Tag className={classes} {...extra} {...props}>
      {children}
    </Tag>
  );
}
