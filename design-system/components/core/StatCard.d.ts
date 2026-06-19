import React from 'react';

/**
 * @startingPoint section="Components" subtitle="大數字統計卡片，Dashboard 核心展示元素" viewport="700x200"
 */
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
  style?: React.CSSProperties;
}

export declare function StatCard(props: StatCardProps): JSX.Element;
