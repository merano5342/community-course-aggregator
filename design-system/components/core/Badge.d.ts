import React from 'react';

export interface BadgeProps {
  children?: React.ReactNode;
  /** 顏色語意 */
  variant?: 'accent' | 'dark' | 'neutral' | 'success' | 'warning' | 'error';
  /** 顯示圓點指示器 */
  dot?: boolean;
}

export declare function Badge(props: BadgeProps): JSX.Element;
