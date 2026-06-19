import React from 'react';

export interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  /** 左側前綴（通常為 SVG 圖示） */
  prefix?: React.ReactNode;
  /** 右側後綴 */
  suffix?: React.ReactNode;
  style?: React.CSSProperties;
}

export declare function Input(props: InputProps): JSX.Element;
