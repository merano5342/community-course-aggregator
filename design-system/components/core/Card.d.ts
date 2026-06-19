import React from 'react';

export interface CardProps {
  children?: React.ReactNode;
  /** 卡片顏色主題 */
  variant?: 'light' | 'dark' | 'accent' | 'white' | 'surface';
  /** 內距：true=預設, false=無, string=自訂 */
  padding?: boolean | string;
  /** 圓角大小 */
  radius?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  style?: React.CSSProperties;
}

export declare function Card(props: CardProps): JSX.Element;
