import React from 'react';

export function Tag({
  children,
  color = 'default',
  size = 'md',
  removable = false,
  onRemove,
}) {
  const colorMap = {
    default: { background: 'var(--color-surface-card)',   color: 'var(--color-text-secondary)' },
    accent:  { background: 'var(--color-accent-subtle)',  color: 'var(--color-accent)' },
    dark:    { background: 'var(--color-dark)',            color: 'var(--color-text-on-dark)' },
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        padding: size === 'sm' ? '2px 10px' : '5px 14px',
        borderRadius: 'var(--radius-pill)',
        fontSize: size === 'sm' ? 'var(--text-xs)' : 'var(--text-sm)',
        fontWeight: 'var(--weight-medium)',
        fontFamily: 'var(--font-body)',
        ...colorMap[color],
      }}
    >
      {children}
      {removable && (
        <button
          onClick={onRemove}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            color: 'currentColor',
            opacity: 0.6,
            fontSize: 14,
            lineHeight: 1,
            marginLeft: 2,
          }}
        >
          ×
        </button>
      )}
    </span>
  );
}
