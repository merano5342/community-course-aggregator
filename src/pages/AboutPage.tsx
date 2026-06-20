import { useCourses } from '@/hooks/useCourses';
import { getUniqueSchools, getSchoolInfo } from '@/lib/courseUtils';

const TECH_STACK = [
  'React 19 + Vite', 'React Router v7', 'TypeScript', 'Tailwind v4 + shadcn/ui',
  'Zustand', 'TanStack Query', 'Node.js + cheerio（爬蟲）', 'GitHub Actions',
];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 style={{
        fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)',
        margin: '0 0 var(--space-3)',
        paddingBottom: 'var(--space-2)', borderBottom: 'var(--border-subtle)',
      }}>
        {title}
      </h2>
      <div style={{ fontSize: 'var(--text-base)', lineHeight: 'var(--leading-normal)', color: 'var(--color-text-primary)' }}>
        {children}
      </div>
    </section>
  );
}

export function AboutPage() {
  const { courses } = useCourses();
  const schools = getUniqueSchools(courses);
  const schoolStats = schools.map((s) => ({
    ...getSchoolInfo(s),
    count: courses.filter((c) => c.school === s).length,
    key: s,
  }));

  return (
    <div style={{ maxWidth: 640, display: 'flex', flexDirection: 'column', gap: 'var(--space-7)' }}>
      {/* Hero */}
      <div>
        <h1 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-2xl)', fontWeight: 'var(--weight-bold)' }}>
          鄰學（Lín Xué）
        </h1>
        <p style={{ margin: 0, fontSize: 'var(--text-md)', color: 'var(--color-text-secondary)', lineHeight: 'var(--leading-normal)' }}>
          社區大學課程整合平台 · 跨校搜尋、比較、收藏課程
        </p>
        <div style={{ marginTop: 'var(--space-3)' }}>
          <span style={{
            display: 'inline-block', padding: '4px 12px', borderRadius: 'var(--radius-pill)',
            background: 'var(--color-accent-subtle)', color: 'var(--color-accent)',
            fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)',
          }}>
            v0.1.0 ・ Side Project
          </span>
        </div>
      </div>

      <Section title="平台介紹">
        <p style={{ margin: '0 0 var(--space-3)' }}>
          台北市各社區大學均採用同一套 frog.tw 課務系統，但各校只有單校查詢介面。使用者若想橫向比較多校課程，必須分開瀏覽多個網站，且現有 UI 在行動裝置上體驗不佳。
        </p>
        <p style={{ margin: 0 }}>
          鄰學整合多所社大課程資料，讓您一站式搜尋、比較最多 3 門課程並排、收藏候選清單、以週曆視圖確認時段不衝堂，最後點擊報名連結前往原校系統完成報名。
        </p>
      </Section>

      <Section title="資料來源">
        <ul style={{ margin: 0, padding: '0 0 0 var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <li>資料來源：各台北市社大課務系統（frog.tw 平台）</li>
          <li>抓取內容：課程名稱、老師、時間、費用、地點、開課狀態等公開欄位</li>
          <li>不含課程介紹全文、老師照片或任何個人資料</li>
          <li>每門課均附原始報名連結，點擊後導向原校官方系統</li>
        </ul>
      </Section>

      <Section title="支援學校">
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 'var(--card-gap)',
        }}>
          {schoolStats.map((s) => (
            <div
              key={s.key}
              style={{
                padding: 'var(--space-3) var(--space-4)',
                background: 'var(--color-white)',
                borderRadius: 'var(--radius-lg)',
                border: 'var(--border-subtle)',
                display: 'flex', flexDirection: 'column', gap: 4,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 10, height: 10, borderRadius: '50%', background: s.color, flexShrink: 0,
                }} />
                <span style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-base)' }}>
                  {s.name}
                </span>
              </div>
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                {s.count} 門課程
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="資料更新頻率">
        <div style={{
          background: 'var(--color-surface-card)', borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)',
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
        }}>
          <div>更新時間：每週一 00:00 UTC 自動執行</div>
          <div>方式：GitHub Actions 觸發爬蟲，結果 commit 至 data/courses/</div>
          <div style={{ color: 'var(--color-text-muted)' }}>額滿狀態僅供參考，以各校官方系統為準</div>
        </div>
      </Section>

      <Section title="免責聲明">
        <p style={{ margin: '0 0 var(--space-2)', color: 'var(--color-text-secondary)' }}>
          本平台為社群自主建置之非官方資訊整合工具，與各社大及 frog.tw 無任何官方合作關係。
        </p>
        <p style={{ margin: '0 0 var(--space-2)', color: 'var(--color-text-secondary)' }}>
          課程資訊（尤其名額狀態）可能與原校系統有落差，報名前請以<strong>原校官方課務系統</strong>為準。
        </p>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
          如任何學校對資料使用有疑慮，請透過 GitHub Issue 聯繫，將立即移除對應學校資料。
        </p>
      </Section>

      <Section title="技術架構">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {TECH_STACK.map((t) => (
            <span key={t} style={{
              padding: '4px 10px', borderRadius: 'var(--radius-pill)',
              background: 'var(--color-surface-card)',
              fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
            }}>
              {t}
            </span>
          ))}
        </div>
      </Section>

      <Section title="回報問題 / 原始碼">
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <a
            href="https://github.com/MeranoTu/community-course-aggregator/issues"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 18px', background: 'var(--color-dark)', color: 'white',
              borderRadius: 'var(--radius-md)', textDecoration: 'none',
              fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            回報問題 / GitHub
          </a>
        </div>
      </Section>
    </div>
  );
}
