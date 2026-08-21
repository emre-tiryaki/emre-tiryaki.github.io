// Genel amaçlı form state + validasyon hook'u.
// Hem mesaj formu, hem yorum formu, hem de admin post oluşturma
// formu buradan besleniyor — tek kaynak, tutarlı davranış.
//
// Kullanım:
//   const { values, errors, setField, handleSubmit, reset, isSubmitting } =
//     useForm({
//       initial: { name: '', email: '', message: '' },
//       validate: (v) => {
//         const e = {};
//         if (!v.name.trim()) e.name = 'boş olamaz';
//         return e;
//       },
//       onSubmit: async (v) => { await send(v); },
//     });

import { useState, useCallback } from 'react';

export default function useForm({
  initial = {},
  validate = () => ({}),
  onSubmit,
}) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const reset = useCallback(
    (next = initial) => {
      setValues(next);
      setErrors({});
      setIsSubmitting(false);
    },
    [initial]
  );

  const handleSubmit = useCallback(
    async (e, meta) => {
      if (e && typeof e.preventDefault === 'function') e.preventDefault();
      const validationErrors = validate(values);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setIsSubmitting(true);
      try {
        await onSubmit(values, meta);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  return { values, errors, setField, handleSubmit, reset, isSubmitting };
}
