import React from 'react';

/**
 * @startingPoint section="Navigation" subtitle="72px 深色垂直導航側欄，含品牌標誌" viewport="72x500"
 */
export interface AppSidebarProps {
  /** 目前活躍的導航項目 ID */
  activeItem?: 'browse' | 'courses' | 'saved' | 'stats';
  /** 點擊導航項目的 callback */
  onNavigate?: (id: string) => void;
}

export declare function AppSidebar(props: AppSidebarProps): JSX.Element;
