import type { CSSProperties, ReactNode } from 'react';

export interface ButtonProps {
  children?: ReactNode;
  /** 視覺樣式 */
  variant?: 'primary' | 'dark' | 'ghost' | 'accent' | 'surface';
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 膠囊圓角 */
  pill?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  pill = false,
  disabled = false,
  onClick,
  style: extraStyle,
}: ButtonProps) {
  const rounding = pill
    ? 'var(--radius-pill)'
    : size === 'lg'
      ? 'var(--radius-lg)'
      : 'var(--radius-md)';

  const sizeMap: Record<NonNullable<ButtonProps['size']>, CSSProperties> = {
    sm: { height: 'var(--btn-height-sm)', padding: '0 var(--space-3)', fontSize: 'var(--text-sm)' },
    md: { height: 'var(--btn-height-md)', padding: '0 var(--space-5)', fontSize: 'var(--text-base)' },
    lg: { height: 'var(--btn-height-lg)', padding: '0 var(--space-6)', fontSize: 'var(--text-md)' },
  };

  const variantMap: Record<NonNullable<ButtonProps['variant']>, CSSProperties> = {
    primary: { background: 'var(--color-accent)', color: 'var(--color-text-on-accent)' },
    dark: { background: 'var(--color-dark)', color: 'var(--color-text-on-dark)' },
    ghost: { background: 'transparent', color: 'var(--color-text-primary)', outline: 'var(--border-medium)' },
    accent: { background: 'var(--color-accent-subtle)', color: 'var(--color-accent)' },
    surface: { background: 'var(--color-surface-card)', color: 'var(--color-text-primary)' },
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-2)',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontFamily: 'var(--font-body)',
        fontWeight: 'var(--weight-semibold)',
        letterSpacing: 'var(--tracking-wide)',
        transition: 'background var(--dur-fast) var(--ease-std), opacity var(--dur-fast)',
        opacity: disabled ? 'var(--opacity-disabled)' : 1,
        whiteSpace: 'nowrap',
        lineHeight: 'normal',
        borderRadius: rounding,
        ...sizeMap[size],
        ...variantMap[variant],
        ...extraStyle,
      }}
    >
      {children}
    </button>
  );
}
