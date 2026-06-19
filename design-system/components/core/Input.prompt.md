文字輸入框，膠囊外型（border-radius: pill）。主要用於課程搜尋列和表單欄位。

```jsx
<Input placeholder="搜尋課程名稱、關鍵字" />

<Input
  prefix={
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  }
  placeholder="搜尋課程..."
  value={query}
  onChange={e => setQuery(e.target.value)}
/>
```

**prefix / suffix**: 傳入 React node（通常為 SVG icon），自動 left-pad/right-pad
高度固定 44px，全寬，border-radius: pill
