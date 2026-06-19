應用程式主導航側欄，72px 寬，深色背景。內含品牌標誌（2×2 格點）和 icon-only 導航按鈕。

```jsx
<AppSidebar
  activeItem="browse"
  onNavigate={(id) => setView(id)}
/>
```

**activeItem**: `'browse'` | `'courses'` | `'saved'` | `'stats'`
**onNavigate**: 接收點擊項目的 id，用於切換主視圖
需要固定高度容器（height: 100vh 或 100%），flexShrink: 0
Icons 採 Lucide 風格 SVG（stroke-width: 1.5，無填色）
