import { Link } from 'react-router-dom';
import { MOCK_ANNOUNCEMENTS, CURRENT_SEMESTER } from '@/data/mockAnnouncements';
import { useAnnouncementFilterStore } from '@/stores/useAnnouncementFilterStore';
import { useCourses } from '@/hooks/useCourses';
import { getSchoolInfo, getUniqueSchools } from '@/lib/courseUtils';
import type { Announcement } from '@/types/announcement';

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  registration: { label: '報名資訊', color: 'var(--color-accent)', bg: 'var(--color-accent-subtle)' },
  schedule:     { label: '課程公告', color: 'var(--color-info)', bg: 'var(--color-info-subtle)' },
  cancel:       { label: '停辦通知', color: 'var(--color-error)', bg: 'var(--color-error-subtle)' },
  venue:        { label: '場地通知', color: '#9b7040', bg: '#edd9c0' },
  general:      { label: '一般公告', color: 'var(--color-text-secondary)', bg: 'var(--color-surface-card)' },
};

function daysBetween(dateStr: string): number {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

function AnnouncementCard({ ann }: { ann: Announcement }) {
  const typeConf = TYPE_CONFIG[ann.type] ?? TYPE_CONFIG.general;
  const schoolLabel = ann.school === 'all'
    ? '全平台'
    : getSchoolInfo(ann.school).name;
  const schoolColor = ann.school === 'all'
    ? 'var(--color-text-secondary)'
    : getSchoolInfo(ann.school).color;
  const schoolBg = ann.school === 'all'
    ? 'var(--color-surface-card)'
    : getSchoolInfo(ann.school).bg;
  const dateStr = new Date(ann.date).toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' });

  return (
    <div style={{
      background: 'var(--color-white)',
      borderRadius: 'var(--radius-lg)',
      border: ann.important ? '1.5px solid var(--color-accent)' : 'var(--border-subtle)',
      padding: 'var(--space-4)',
      display: 'flex', flexDirection: 'column', gap: 'var(--space-2)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{
          padding: '2px 8px', borderRadius: 'var(--radius-pill)',
          fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)',
          background: schoolBg, color: schoolColor,
        }}>
          {schoolLabel}
        </span>
        <span style={{
          padding: '2px 8px', borderRadius: 'var(--radius-pill)',
          fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-medium)',
          background: typeConf.bg, color: typeConf.color,
        }}>
          {typeConf.label}
        </span>
        {ann.important && (
          <span style={{
            padding: '2px 8px', borderRadius: 'var(--radius-pill)',
            fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)',
            background: 'var(--color-error-subtle)', color: 'var(--color-error)',
          }}>
            重要
          </span>
        )}
        <span style={{ marginLeft: 'auto', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
          {dateStr}
        </span>
      </div>
      <div style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>
        {ann.title}
      </div>
      <p style={{
        margin: 0, fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)',
        lineHeight: 'var(--leading-normal)',
        whiteSpace: 'pre-line',
        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {ann.content}
      </p>
      {ann.link && (
        <a
          href={ann.link}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 'var(--text-sm)', color: 'var(--color-accent)', textDecoration: 'none', fontWeight: 'var(--weight-medium)' }}
        >
          前往官網 ↗
        </a>
      )}
    </div>
  );
}

function SemesterBanner() {
  const regStart = daysBetween(CURRENT_SEMESTER.registrationStart);
  const semStart = daysBetween(CURRENT_SEMESTER.semesterStart);

  return (
    <div style={{
      background: 'var(--color-dark)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-5) var(--space-6)',
      color: 'white',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      flexWrap: 'wrap', gap: 'var(--space-4)',
    }}>
      <div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.55)', marginBottom: 4, letterSpacing: 'var(--tracking-wide)' }}>
          當前學期
        </div>
        <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--weight-bold)', fontFamily: 'var(--font-display)' }}>
          {CURRENT_SEMESTER.name}
        </div>
        <div style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>
          {new Date(CURRENT_SEMESTER.semesterStart).toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' })} –{' '}
          {new Date(CURRENT_SEMESTER.semesterEnd).toLocaleDateString('zh-TW', { month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.55)', marginBottom: 4 }}>報名開始</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'var(--color-accent-on-dark)' }}>
            {regStart > 0 ? `${regStart} 天後` : regStart === 0 ? '今天' : '已開始'}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.50)' }}>
            {new Date(CURRENT_SEMESTER.registrationStart).toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' })}
          </div>
        </div>
        <div style={{ width: 1, background: 'rgba(255,255,255,0.12)', alignSelf: 'stretch' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.55)', marginBottom: 4 }}>開學日</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)', color: 'rgba(255,255,255,0.90)' }}>
            {semStart > 0 ? `${semStart} 天後` : semStart === 0 ? '今天' : '已開始'}
          </div>
          <div style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.50)' }}>
            {new Date(CURRENT_SEMESTER.semesterStart).toLocaleDateString('zh-TW', { month: 'numeric', day: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  const { selectedSchools, toggle, clear } = useAnnouncementFilterStore();
  const { courses } = useCourses();
  const schools = getUniqueSchools(courses);

  const filtered = MOCK_ANNOUNCEMENTS.filter((a) => {
    if (selectedSchools.length === 0) return true;
    return selectedSchools.includes(a.school) || a.school === 'all';
  }).sort((a, b) => {
    if (a.important && !b.important) return -1;
    if (!a.important && b.important) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: 760 }}>
      <SemesterBanner />

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 'var(--space-3)' }}>
        {[
          { to: '/courses', icon: '📋', label: '瀏覽課程', desc: `${courses.length} 門課程` },
          { to: '/favorites', icon: '♥', label: '我的最愛', desc: '收藏的課程' },
          { to: '/schedule', icon: '📅', label: '時間表', desc: '確認時段不衝堂' },
          { to: '/compare', icon: '📊', label: '跨校比較', desc: '並排比較課程' },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-lg)',
              border: 'var(--border-subtle)',
              padding: 'var(--space-4)',
              textDecoration: 'none',
              display: 'flex', flexDirection: 'column', gap: 'var(--space-1)',
              transition: 'border-color var(--dur-fast), box-shadow var(--dur-fast)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-accent)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '';
            }}
          >
            <div style={{ fontSize: 22, marginBottom: 4 }}>{item.icon}</div>
            <div style={{ fontWeight: 'var(--weight-semibold)', fontSize: 'var(--text-base)', color: 'var(--color-text-primary)' }}>
              {item.label}
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
              {item.desc}
            </div>
          </Link>
        ))}
      </div>

      {/* Announcements */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <h2 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 'var(--weight-bold)' }}>最新公告</h2>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* School filter chips */}
            <button
              onClick={clear}
              style={{
                padding: '4px 12px', borderRadius: 'var(--radius-pill)',
                border: selectedSchools.length === 0 ? '1.5px solid var(--color-accent)' : 'var(--border-medium)',
                background: selectedSchools.length === 0 ? 'var(--color-accent-subtle)' : 'transparent',
                color: selectedSchools.length === 0 ? 'var(--color-accent)' : 'var(--color-text-muted)',
                fontSize: 'var(--text-sm)', cursor: 'pointer', fontWeight: 'var(--weight-medium)',
              }}
            >
              全部
            </button>
            {schools.map((s) => {
              const info = getSchoolInfo(s);
              const active = selectedSchools.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => toggle(s)}
                  style={{
                    padding: '4px 12px', borderRadius: 'var(--radius-pill)',
                    border: active ? `1.5px solid ${info.color}` : 'var(--border-medium)',
                    background: active ? info.bg : 'transparent',
                    color: active ? info.color : 'var(--color-text-muted)',
                    fontSize: 'var(--text-sm)', cursor: 'pointer', fontWeight: 'var(--weight-medium)',
                  }}
                >
                  {info.short}
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: 'var(--space-8)',
            color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)',
          }}>
            目前沒有符合條件的公告
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {filtered.map((ann) => (
              <AnnouncementCard key={ann.id} ann={ann} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
