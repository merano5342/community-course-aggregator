import React from 'react';

/**
 * @startingPoint section="Components" subtitle="主要互動按鈕，primary / dark / ghost / accent" viewport="700x130"
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** 視覺樣式 */
  variant?: 'primary' | 'dark' | 'ghost' | 'accent' | 'surface';
  /** 尺寸 */
  size?: 'sm' | 'md' | 'lg';
  /** 膠囊圓角 */
  pill?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export declare function Button(props: ButtonProps): JSX.Element;
