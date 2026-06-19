# 鄰學 Design System
> 社區大學課程資訊整合平台

**鄰學**（Lín Xué）是一個整合台灣各地社區大學課程資訊的平台，讓居民能夠輕鬆搜尋、收藏、報名課程，並追蹤個人學習歷程。

> ⚠️ 注意：品牌名稱「鄰學」為設計系統建立時的建議名稱，請告知是否需要更換。

---

## Sources
- 設計參考：用戶提供的扁平化 Dashboard UI 截圖（橘色改為莫蘭迪藍綠）
- 無外部 Figma 連結或程式碼庫（從零建構）

---

## Visual Foundations

### Color System
**主題色：莫蘭迪藍綠（Morandi Blue-Green）**
橘色系完全替換為低飽和度、帶有灰感的藍綠色 — 現代感同時保有溫潤質感。

| Token | Hex | Usage |
|---|---|---|
| `--color-accent` | `#3e8a84` | 主要強調色、按鈕、數字highlight |
| `--color-accent-hover` | `#2d6f6a` | hover 狀態 |
| `--color-accent-light` | `#76b3ae` | 次要強調 |
| `--color-accent-subtle` | `#c8e0de` | 淺底色、badge 背景 |
| `--color-dark` | `#1c1c1c` | 深色卡片、側欄背景 |
| `--color-surface-bg` | `#f0eeeb` | 頁面主背景（暖灰）|
| `--color-surface-card` | `#e6e4e1` | 卡片背景 |

### Typography
- **Display/Numbers**: Space Grotesk（Google Fonts）— 幾何感強，適合大數字
- **中文內文**: Noto Sans TC（Google Fonts）
- **兩者搭配使用**，Space Grotesk 優先排英數、Noto Sans TC 負責中文字元
- ⚠️ 使用 Google Fonts CDN，離線環境需額外處理

### Design Principles
- **完全扁平化**：無 box-shadow，純色塊堆疊
- **Bento Grid**：不同大小卡片組成動態格狀布局，視覺層次豐富
- **深色側欄**：`#1c1c1c` 窄側欄（72px），icon 只顯示，無文字標籤
- **大字數據**：課程數量、報名人數等以超大粗體數字呈現，保留 `/ +12%` delta 格式
- **Pill 形狀**：英雄 StatCard 使用 `border-radius: 999px` 的膠囊形狀
- **無動畫**：過渡限於 `120ms` 的 background/opacity 切換，不使用 bounce/spring
- **Hover 狀態**：背景加深（同色系 darken），無 scale 縮放
- **無陰影**：完全 flat，卡片以背景色差異區分層次

### Color Vibe
- 背景暖灰（帶米色調）
- 深色為近黑（`#1c1c1c`），非純黑
- 強調色莫蘭迪藍綠 — 不過飽和，帶灰感
- 整體偏冷靜、知性，適合學習平台

### Backgrounds & Imagery
- 無全版底圖
- 強調色卡片可作滿版背景（如 bento 中的 CTA 卡）
- 深色卡片（`#1c1c1c`）+ 白字，形成視覺重點
- 偶爾使用幾何圓點陣列作裝飾元素（參考圖中右上角 dot-grid）

### Corner Radius
- `sm`: 6px — 小元素、badge
- `md`: 12px — 按鈕、tag
- `lg`: 20px — 卡片
- `xl`: 28px — 大卡片
- `pill`: 999px — 膠囊形按鈕、英雄 stat

---

## Content Fundamentals
- **主要語言**：繁體中文
- **語氣**：親切、平易近人，不正式但專業；以「你」稱呼使用者
- **文案風格**：簡潔有力，避免冗長。課程名稱直述（「水彩畫入門」）；CTA 動詞放前（「立即報名」「搜尋課程」）
- **數字格式**：直接使用阿拉伯數字（142 門課程，不寫「一百四十二」）
- **Emoji**：不使用
- **英文混用**：品牌名、技術名詞可保留英文（Dashboard、UI）

---

## Iconography
- **採用 Lucide Icons**（CDN 載入，stroke-width: 1.5，與整體扁平風格一致）
- SVG 格式，非 icon font
- 側欄 navigation icons：grid（瀏覽）/ list（課程）/ bookmark（收藏）/ bar-chart（學習紀錄）
- 一律 20×20px，stroke-only，不填色
- 顏色繼承父元素 `color`，active 狀態用 `--color-accent-on-dark`
- ⚠️ 圖示使用 Lucide CDN，無本地 SVG 拷貝

---

## Files Index

### Tokens
- `tokens/colors.css` — 完整色彩 custom properties
- `tokens/typography.css` — 字型載入 + 尺寸/粗細 tokens
- `tokens/spacing.css` — 間距、版型尺寸 tokens
- `tokens/effects.css` — 圓角、邊框、過渡 tokens
- `styles.css` — entry point（只含 @import）

### Assets
- `assets/logo.svg` — 主 logo（淺色背景用）
- `assets/logo-white.svg` — 白色版 logo（深色背景用）

### Foundation Cards（Design System tab → Colors / Type / Spacing / Brand）
- `guidelines/colors-accent.card.html`
- `guidelines/colors-neutral.card.html`
- `guidelines/colors-surface.card.html`
- `guidelines/type-display.card.html`
- `guidelines/type-scale.card.html`
- `guidelines/type-chinese.card.html`
- `guidelines/spacing-tokens.card.html`
- `guidelines/spacing-radius.card.html`
- `guidelines/brand-logo.card.html`

### Components（Design System tab → Components）
- `components/core/` — Button, Badge, Card, Tag, Input, StatCard
- `components/navigation/` — AppSidebar

### UI Kit
- `ui_kits/platform/index.html` — 課程平台完整互動原型（瀏覽 / 課程詳情 / 我的學習）
