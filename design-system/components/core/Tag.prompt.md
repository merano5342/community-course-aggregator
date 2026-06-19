課程分類標籤，用於課程卡片的類別顯示與篩選列表。

```jsx
<Tag>語言學習</Tag>
<Tag color="accent">熱門課程</Tag>
<Tag color="dark" size="sm">週末班</Tag>
<Tag removable onRemove={() => {}}>藝術創作</Tag>
```

**color**: `default`（灰底）/ `accent`（藍綠底）/ `dark`（深色底）
**size**: `sm`（較小 11px）/ `md`（預設 13px）
**removable**: 顯示 × 移除按鈕，配合 onRemove callback
