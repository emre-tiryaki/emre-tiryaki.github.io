// Yeniden kullanılabilir form alanı (input / textarea).
// Mesaj formu, yorum formu ve admin post oluşturma formu bunu kullanır.
// Tailwind --spacing bug'ından etkilenmemesi için temel stiller inline/CSS'tir.

import { forwardRef } from 'react';
import { THEME_COLORS } from '../../theme';

const { accent, surface, status, text } = THEME_COLORS;

const BASE_INPUT = {
  width: '100%',
  background: surface.input,
  border: `1px solid ${surface.white08}`,
  color: text.primary,
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
  el.style.borderColor = hasError ? status.dangerBorderStrong : accent.a60;
  el.style.background = surface.inputFocus;
  el.style.boxShadow = hasError
    ? `0 0 0 3px ${status.dangerGlow}`
    : `0 0 16px ${accent.a15}, 0 0 0 1px ${accent.a30}`;
}
function blurStyle(el) {
  if (!el) return;
  el.style.borderColor = surface.white08;
  el.style.background = surface.input;
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
        <span style={{ fontSize: '0.72rem', color: status.dangerSoft }}>{error}</span>
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
