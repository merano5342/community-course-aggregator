import type { CSSProperties, ReactNode } from 'react';

export interface CardProps {
  children?: ReactNode;
  /** 卡片顏色主題 */
  variant?: 'light' | 'dark' | 'accent' | 'white' | 'surface';
  /** 內距：true=預設, false=無, string=自訂 */
  padding?: boolean | string;
  /** 圓角大小 */
  radius?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  style?: CSSProperties;
}

export function Card({
  children,
  variant = 'light',
  padding = true,
  radius = 'lg',
  onClick,
  style: extraStyle,
}: CardProps) {
  const variantMap: Record<NonNullable<CardProps['variant']>, CSSProperties> = {
    light: { background: 'var(--color-surface-card)', color: 'var(--color-text-primary)' },
    dark: { background: 'var(--color-dark)', color: 'var(--color-text-on-dark)' },
    accent: { background: 'var(--color-accent)', color: 'var(--color-text-on-accent)' },
    white: { background: 'var(--color-white)', color: 'var(--color-text-primary)' },
    surface: { background: 'var(--color-surface-bg)', color: 'var(--color-text-primary)' },
  };

  const radiusMap: Record<NonNullable<CardProps['radius']>, string> = {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
  };

  const paddingValue = padding === true ? 'var(--space-5)' : padding === false ? '0' : padding;

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
