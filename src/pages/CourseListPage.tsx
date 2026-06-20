import { StatCard } from '@/components/core/StatCard';
import { Card } from '@/components/core/Card';

export function CourseListPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--card-gap)' }}>
        <StatCard label="課程總數" value={142} variant="light" />
        <StatCard label="本週新開課" value={8} delta="+12%" variant="dark" />
        <StatCard label="已收藏" value={3} variant="accent" />
      </div>
      <Card variant="white" radius="xl">
        課程列表頁（PRD 2.1）— 待接入課程資料與篩選元件
      </Card>
    </div>
  );
}
