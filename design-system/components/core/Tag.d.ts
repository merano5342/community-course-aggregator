import React from 'react';

export interface TagProps {
  children?: React.ReactNode;
  /** 顏色語意，用於課程分類標籤 */
  color?: 'default' | 'accent' | 'dark';
  /** 尺寸 */
  size?: 'sm' | 'md';
  /** 可移除模式 */
  removable?: boolean;
  onRemove?: () => void;
}

export declare function Tag(props: TagProps): JSX.Element;
