export default function PageLayout({
  title,
  subtitle,
  children,
  maxWidth = '72rem',
  fullHeight = false,
  className = '',
  style = {},
}) {
  const baseStyle = {
    width: '100%',
    maxWidth,
    margin: '0 auto',
    paddingLeft: '1.5rem',
    paddingRight: '1.5rem',
    paddingTop: '0.5rem',
    paddingBottom: fullHeight ? '0' : '3rem',
    display: 'flex',
    flexDirection: 'column',
    height: fullHeight ? '100%' : 'auto',
    minHeight: fullHeight ? '100%' : 'auto',
    overflow: fullHeight ? 'hidden' : 'visible',
    boxSizing: 'border-box',
    ...style,
  };

  return (
    <div style={baseStyle} className={className}>
      {/* Standardized Page Header — identical position across all pages */}
      {(title || subtitle) && (
        <div
          className="text-center flex-shrink-0 w-full"
          style={{
            paddingTop: '0.25rem',
            paddingBottom: '1.5rem',
          }}
        >
          {title && (
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-base text-neutral-400 mt-1 leading-normal">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Page Content */}
      {children}
    </div>
  );
}
