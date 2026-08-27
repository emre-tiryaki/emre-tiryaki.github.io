// Yeniden kullanılabilir form alanı (input / textarea).
// Mesaj formu, yorum formu ve admin post oluşturma formu bunu kullanır.
// Tailwind --spacing bug'ından etkilenmemesi için temel stiller inline/CSS'tir.

import { forwardRef } from 'react';

const BASE_INPUT = {
  width: '100%',
  background: 'rgba(255, 255, 255, 0.035)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  color: '#f8fafc',
  fontSize: '0.875rem',
  borderRadius: '0.75rem',
  padding: '0.65rem 0.9rem',
  outline: 'none',
  transition: 'border-color 160ms ease, box-shadow 160ms ease, background 160ms ease',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
};

const TEXTAREA_EXTRA = { resize: 'vertical', lineHeight: '1.6' };

function focusStyle(el, hasError) {
  if (!el) return;
  el.style.borderColor = hasError ? 'rgba(239, 68, 68, 0.7)' : 'rgba(249, 115, 22, 0.6)';
  el.style.background = 'rgba(255, 255, 255, 0.055)';
  el.style.boxShadow = hasError
    ? '0 0 0 3px rgba(239, 68, 68, 0.15)'
    : '0 0 16px rgba(249, 115, 22, 0.15), 0 0 0 1px rgba(249, 115, 22, 0.3)';
}
function blurStyle(el) {
  if (!el) return;
  el.style.borderColor = 'rgba(255, 255, 255, 0.08)';
  el.style.background = 'rgba(255, 255, 255, 0.035)';
  el.style.boxShadow = 'none';
}

const FormField = forwardRef(function FormField(
  {
    label,
    name,
    type = 'text',
    as = 'input',
    value,
    onChange,
    onBlur,
    placeholder,
    error,
    required,
    help, // string -> "?" yardım baloncuğu (hover)
    rows = 5,
    autoFocus,
    ...rest
  },
  ref
) {
  const handle = (e) => {
    onChange?.(name, e.target.value);
    onBlur?.(name, e.target.value);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
      {label && (
        <label
          htmlFor={name}
          style={{
            fontSize: '0.78rem',
            fontWeight: 600,
            color: '#a3a3a3',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
        >
          {label}
          {required && <span style={{ color: '#fb923c' }}>*</span>}
          {help && <HelpTooltip text={help} />}
        </label>
      )}

      {as === 'textarea' ? (
        <textarea
          id={name}
          ref={ref}
          name={name}
          value={value}
          rows={rows}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onChange={handle}
          onFocus={(e) => focusStyle(e.currentTarget, !!error)}
          onBlur={(e) => {
            blurStyle(e.currentTarget);
            handle(e);
          }}
          style={{ ...BASE_INPUT, ...TEXTAREA_EXTRA }}
          {...rest}
        />
      ) : (
        <input
          id={name}
          ref={ref}
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          autoFocus={autoFocus}
          onChange={handle}
          onFocus={(e) => focusStyle(e.currentTarget, !!error)}
          onBlur={(e) => {
            blurStyle(e.currentTarget);
            handle(e);
          }}
          style={BASE_INPUT}
          {...rest}
        />
      )}

      {error && (
        <span style={{ fontSize: '0.72rem', color: '#fca5a5' }}>{error}</span>
      )}
    </div>
  );
});

export default FormField;

// Hover'da açılan "?" yardım baloncuğu.
export function HelpTooltip({ text }) {
  return (
    <span className="help-tip" tabIndex={0} aria-label={text}>
      ?
      <span className="help-tip__bubble" role="tooltip">
        {text}
      </span>
    </span>
  );
}
