import React from 'react';

export function Card({
  children,
  variant = 'light',
  padding = true,
  radius = 'lg',
  onClick,
  style: extraStyle,
}) {
  const variantMap = {
    light:   { background: 'var(--color-surface-card)', color: 'var(--color-text-primary)' },
    dark:    { background: 'var(--color-dark)',          color: 'var(--color-text-on-dark)' },
    accent:  { background: 'var(--color-accent)',        color: 'var(--color-text-on-accent)' },
    white:   { background: 'var(--color-white)',         color: 'var(--color-text-primary)' },
    surface: { background: 'var(--color-surface-bg)',    color: 'var(--color-text-primary)' },
  };

  const radiusMap = {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
  };

  const paddingValue =
    padding === true  ? 'var(--space-5)' :
    padding === false ? '0' :
    padding;

  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: radiusMap[radius] || radius,
        padding: paddingValue,
        overflow: 'hidden',
        cursor: onClick ? 'pointer' : 'default',
        ...variantMap[variant],
        ...extraStyle,
      }}
    >
      {children}
    </div>
  );
}
