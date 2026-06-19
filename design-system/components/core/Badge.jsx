import React from 'react';

export function Badge({ children, variant = 'accent', dot = false }) {
  const variantMap = {
    accent:  { background: 'var(--color-accent-subtle)',   color: 'var(--color-accent)' },
    dark:    { background: 'var(--color-dark)',             color: 'var(--color-text-on-dark)' },
    neutral: { background: 'var(--color-surface-card)',    color: 'var(--color-text-secondary)' },
    success: { background: 'var(--color-success-subtle)',  color: 'var(--color-success)' },
    warning: { background: 'var(--color-warning-subtle)',  color: 'var(--color-warning)' },
    error:   { background: 'var(--color-error-subtle)',    color: 'var(--color-error)' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        padding: '3px 10px',
        borderRadius: 'var(--radius-pill)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--weight-semibold)',
        letterSpacing: 'var(--tracking-wide)',
        fontFamily: 'var(--font-body)',
        ...variantMap[variant],
      }}
    >
      {dot && (
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: 'currentColor',
            flexShrink: 0,
          }}
        />
      )}
      {children}
    </span>
  );
}
