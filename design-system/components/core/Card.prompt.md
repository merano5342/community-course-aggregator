Bento 格局的核心容器元件。三種顏色主題混搭出層次豐富的視覺網格。

```jsx
<Card variant="light">預設淺色卡片</Card>
<Card variant="dark">深色重點卡片</Card>
<Card variant="accent">強調色行動卡片</Card>
<Card variant="white" radius="xl">白色大圓角</Card>
<Card padding={false}>無內距（自訂排版）</Card>
<Card padding="32px 40px">自訂內距</Card>
<Card onClick={() => navigate('/course/1')}>可點擊卡片</Card>
```

**variant**: `light`（暖灰底）/ `dark`（近黑底）/ `accent`（藍綠底）/ `white`（白底）/ `surface`（頁面底色）
**radius**: `sm`(6) / `md`(12) / `lg`(20) / `xl`(28)
**padding**: true=24px / false=0 / string=自訂值
