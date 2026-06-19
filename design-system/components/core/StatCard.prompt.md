大數字展示卡，設計系統的視覺核心。用於 Dashboard 的主要統計數字展示。

```jsx
<StatCard label="全部課程" value="142" />
<StatCard label="本週新增" value="27" delta="+8%" deltaLabel="相比上週" />
<StatCard label="進行中課程" value="8" variant="dark" accentBar />
<StatCard label="已報名" value="3" variant="accent" pill />
```

**variant**: `light`（暖灰底）/ `dark`（近黑底）/ `accent`（藍綠底）
**pill**: 膠囊形狀，用於英雄統計（較大內距）
**accentBar**: 底部顯示 3px 強調色條
**delta**: 顯示變化量，格式為 `27 / +8%`（斜線前為數字）
