import { useState } from 'react';
import useForm from '../../hooks/useForm';
import { useTranslation } from '../../hooks/translation';
import { submitComment } from '../../hooks/useComments';
import FormField from '../ui/FormField';
import Button from '../ui/Button';

// Blog yorum formu (ana yorum + yanıt). Gönderim pending olarak gider,
// admin onayından sonra yayınlanır. Mail opsiyonel — ayrı gizli koleksiyona yazılır.
export default function CommentForm({ postId, parentId = null, onDone, autoFocus = false }) {
  const { t } = useTranslation();
  const f = t('blog.commentForm');
  const isReply = !!parentId;
  const [sent, setSent] = useState(false);

  const form = useForm({
    initial: { authorName: '', email: '', content: '' },
    validate: (v) => {
      const e = {};
      if (!v.authorName.trim()) e.authorName = f.emptyName;
      if (!v.content.trim()) e.content = f.emptyContent;
      return e;
    },
    onSubmit: async (v) => {
      await submitComment({
        postId,
        parentId,
        authorName: v.authorName,
        content: v.content,
        email: v.email,
      });
      setSent(true);
      if (onDone) onDone();
    },
  });

  if (sent) {
    return (
      <div
        className="glass-card rounded-xl"
        style={{ padding: '1rem', color: '#a3a3a3', fontSize: '0.85rem' }}
      >
        {f.success}
      </div>
    );
  }

  return (
    <form
      onSubmit={form.handleSubmit}
      className="glass-card rounded-xl"
      style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: '0.75rem' }}>
        <FormField
          label={f.name}
          name="authorName"
          value={form.values.authorName}
          onChange={form.setField}
          placeholder={f.namePlaceholder}
          required
          error={form.errors.authorName}
        />
        <FormField
          label={f.email}
          name="email"
          type="email"
          value={form.values.email}
          onChange={form.setField}
          placeholder={f.emailPlaceholder}
          help={f.emailWhy}
          error={form.errors.email}
        />
      </div>

      <FormField
        label={f.content}
        name="content"
        as="textarea"
        rows={3}
        value={form.values.content}
        onChange={form.setField}
        placeholder={f.contentPlaceholder}
        required
        error={form.errors.content}
        autoFocus={autoFocus}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        <span style={{ fontSize: '0.72rem', color: '#737373' }}>{f.loginRequired}</span>
        <Button variant="primary" type="submit" disabled={form.isSubmitting}>
          {form.isSubmitting ? f.submitting : (isReply ? f.replySubmit : f.submit)}
        </Button>
      </div>
    </form>
  );
}
