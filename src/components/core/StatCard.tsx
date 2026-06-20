import type { CSSProperties } from 'react';

export interface StatCardProps {
  /** 卡片標題說明 */
  label?: string;
  /** 主要數值（大數字） */
  value: string | number;
  /** 變化量，如 "+8%" 或 "-3" — 顯示於數字後 "/ +8%" */
  delta?: string;
  /** 變化量說明文字 */
  deltaLabel?: string;
  /** 顏色主題 */
  variant?: 'light' | 'dark' | 'accent';
  /** 膠囊外型（英雄 stat，較大內距） */
  pill?: boolean;
  /** 底部強調色條 */
  accentBar?: boolean;
  style?: CSSProperties;
}

export function StatCard({
  label,
  value,
  delta,
  deltaLabel = '相比昨日',
  variant = 'light',
  pill = false,
  accentBar = false,
  style: extraStyle,
}: StatCardProps) {
  const v = {
    light: {
      bg: 'var(--color-surface-card)',
      labelColor: 'var(--color-text-secondary)',
      valueColor: 'var(--color-text-primary)',
      deltaColor: 'var(--color-accent)',
      metaColor: 'var(--color-text-muted)',
    },
    dark: {
      bg: 'var(--color-dark)',
      labelColor: 'rgba(245,243,240,0.55)',
      valueColor: 'var(--color-text-on-dark)',
      deltaColor: 'var(--color-accent-on-dark)',
      metaColor: 'rgba(245,243,240,0.32)',
    },
    accent: {
      bg: 'var(--color-accent)',
      labelColor: 'rgba(255,255,255,0.70)',
      valueColor: '#ffffff',
      deltaColor: 'rgba(255,255,255,0.90)',
      metaColor: 'rgba(255,255,255,0.55)',
    },
  }[variant];

  return (
    <div
      style={{
        background: v.bg,
        borderRadius: pill ? 'var(--radius-pill)' : 'var(--radius-xl)',
        padding: pill ? 'var(--space-5) var(--space-7)' : 'var(--space-5) var(--space-6) var(--space-6)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        ...extraStyle,
      }}
    >
      {label && (
        <span
          style={{
            fontSize: 'var(--text-sm)',
            color: v.labelColor,
            fontFamily: 'var(--font-body)',
            fontWeight: 'var(--weight-medium)',
          }}
        >
          {label}
        </span>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 'var(--space-3)',
          marginTop: label ? 'var(--space-3)' : 0,
        }}
      >
        <span
          style={{
            fontSize: 'var(--text-5xl)',
            fontWeight: 'var(--weight-bold)',
            color: v.valueColor,
            fontFamily: 'var(--font-display)',
            lineHeight: 'var(--leading-tight)',
            letterSpacing: 'var(--tracking-tight)',
          }}
        >
          {value}
        </span>
        {delta && (
          <span
            style={{
              fontSize: 'var(--text-md)',
              color: v.deltaColor,
              fontFamily: 'var(--font-body)',
              fontWeight: 'var(--weight-medium)',
            }}
          >
            / {delta}
          </span>
        )}
      </div>

      {deltaLabel && (
        <span
          style={{
            fontSize: 'var(--text-xs)',
            color: v.metaColor,
            fontFamily: 'var(--font-body)',
            marginTop: 'var(--space-2)',
          }}
        >
          {deltaLabel}
        </span>
      )}

      {accentBar && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 'var(--space-6)',
            right: 'var(--space-6)',
            height: 3,
            background: v.deltaColor,
            borderRadius: 'var(--radius-pill)',
          }}
        />
      )}
    </div>
  );
}
