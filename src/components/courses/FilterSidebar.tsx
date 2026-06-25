import type { CourseStatus, TimeSlot } from '@/types/course';
import { getSchoolInfo, DAY_LABELS, TIME_SLOT_LABELS, TIME_SLOT_ICON, STATUS_INFO } from '@/lib/courseUtils';
import { type FilterState, DEFAULT_FILTERS } from './filterState';

function TimeSlotIcon({ slot, size = 14 }: { slot: TimeSlot; size?: number }) {
  const icon = TIME_SLOT_ICON[slot];
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {icon.circle && <circle cx={icon.circle[0]} cy={icon.circle[1]} r={icon.circle[2]}/>}
      <path d={icon.path}/>
    </svg>
  );
}

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  availableSchools: string[];
  availableCategories: string[];
  availableSemesters: string[];
  embedded?: boolean;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: 'var(--text-xs)', fontWeight: 'var(--weight-semibold)',
      letterSpacing: 'var(--tracking-wider)', color: 'var(--color-text-muted)',
      textTransform: 'uppercase', marginBottom: 'var(--space-2)',
    }}>
      {children}
    </div>
  );
}

function ToggleChip({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 12px', border: 'none', borderRadius: 'var(--radius-pill)',
        cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
        transition: 'background var(--dur-fast)',
        background: active ? 'var(--color-accent)' : 'var(--color-surface-card)',
        color: active ? 'white' : 'var(--color-text-secondary)',
        display: 'flex', alignItems: 'center', gap: 4,
      }}
    >
      {children}
    </button>
  );
}

function CheckItem({
  checked, onClick, children,
}: { checked: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <label
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
        cursor: 'pointer', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)',
        padding: '4px 0',
      }}
    >
      <span style={{
        width: 16, height: 16, borderRadius: 4, flexShrink: 0,
        border: checked ? 'none' : '1.5px solid var(--color-surface-border)',
        background: checked ? 'var(--color-accent)' : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
            <polyline points="2,6 5,9 10,3"/>
          </svg>
        )}
      </span>
      {children}
    </label>
  );
}

function toggle<T>(arr: T[], val: T): T[] {
  return arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];
}

const ALL_STATUSES: CourseStatus[] = ['open', 'full', 'cancelled', 'delayed'];
const ALL_TIME_SLOTS: TimeSlot[] = ['morning', 'afternoon', 'evening'];

export function FilterSidebar({ filters, onChange, availableSchools, availableCategories, availableSemesters, embedded }: FilterSidebarProps) {
  const f = filters;
  const set = (partial: Partial<FilterState>) => onChange({ ...f, ...partial });

  const timeSlotsChanged = JSON.stringify([...f.timeSlots].sort()) !== JSON.stringify([...DEFAULT_FILTERS.timeSlots].sort());
  const activeCount = [
    f.semesters.length, f.schools.length, f.days.length, timeSlotsChanged ? 1 : 0, f.categories.length,
    f.statuses.length, f.onlyNew ? 1 : 0, !f.excludeSpring ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const displayedSemesters = availableSemesters.filter((s) => !f.excludeSpring || !s.includes('春'));

  return (
    <div style={{
      width: embedded ? '100%' : 220, flexShrink: 0,
      display: 'flex', flexDirection: 'column', gap: 'var(--space-5)',
      padding: embedded ? 'var(--space-4)' : undefined,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-semibold)' }}>
          篩選
          {activeCount > 0 && (
            <span style={{
              marginLeft: 6, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 18, height: 18, borderRadius: '50%',
              background: 'var(--color-accent)', color: 'white', fontSize: 11,
            }}>{activeCount}</span>
          )}
        </span>
        {activeCount > 0 && (
          <button
            onClick={() => onChange(DEFAULT_FILTERS)}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)',
              textDecoration: 'underline',
            }}
          >
            清除全部
          </button>
        )}
      </div>

      {/* 排序 */}
      <div>
        <SectionTitle>排序</SectionTitle>
        <select
          value={f.sortBy}
          onChange={(e) => set({ sortBy: e.target.value as FilterState['sortBy'] })}
          style={{
            width: '100%', height: 36, padding: '0 var(--space-3)',
            border: 'var(--border-medium)', borderRadius: 'var(--radius-md)',
            background: 'var(--color-white)', fontSize: 'var(--text-sm)',
            color: 'var(--color-text-primary)', cursor: 'pointer',
          }}
        >
          <option value="date">開課日期（早→晚）</option>
          <option value="fee-asc">費用（低→高）</option>
          <option value="fee-desc">費用（高→低）</option>
          <option value="school">學校</option>
        </select>
      </div>

      {/* 學期 */}
      {availableSemesters.length > 0 && (
        <div>
          <SectionTitle>學期</SectionTitle>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {displayedSemesters.map((sem) => {
              const isActive = f.semesters.includes(sem);
              const bg = sem.includes('暑') ? '#fde8c4' : sem.includes('春') ? '#d4e8cc' : '#f0d8c8';
              const color = sem.includes('暑') ? '#9a6020' : sem.includes('春') ? '#407840' : '#8a4830';
              return (
                <button
                  key={sem}
                  onClick={() => set({ semesters: toggle(f.semesters, sem) })}
                  style={{
                    padding: '5px 12px', border: 'none', borderRadius: 'var(--radius-pill)',
                    cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
                    transition: 'background var(--dur-fast)',
                    background: isActive ? bg : 'var(--color-surface-card)',
                    color: isActive ? color : 'var(--color-text-secondary)',
                  }}
                >
                  {sem}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 學校 */}
      {availableSchools.length > 0 && (
        <div>
          <SectionTitle>學校</SectionTitle>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {availableSchools.map((school) => {
              const info = getSchoolInfo(school);
              const isActive = f.schools.includes(school);
              return (
                <button
                  key={school}
                  onClick={() => set({ schools: toggle(f.schools, school) })}
                  style={{
                    padding: '5px 10px', border: 'none', borderRadius: 'var(--radius-pill)',
                    cursor: 'pointer', fontSize: 'var(--text-sm)', fontWeight: 'var(--weight-medium)',
                    transition: 'background var(--dur-fast)',
                    background: isActive ? info.bg : 'var(--color-surface-card)',
                    color: isActive ? info.color : 'var(--color-text-secondary)',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: info.color, flexShrink: 0 }}/>
                  {info.short}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 星期 */}
      <div>
        <SectionTitle>星期</SectionTitle>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {[0, 1, 2, 3, 4, 5, 6].map((d) => (
            <ToggleChip key={d} active={f.days.includes(d)} onClick={() => set({ days: toggle(f.days, d) })}>
              {DAY_LABELS[d]}
            </ToggleChip>
          ))}
        </div>
      </div>

      {/* 時段 */}
      <div>
        <SectionTitle>時段</SectionTitle>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {ALL_TIME_SLOTS.map((slot) => (
            <ToggleChip
              key={slot}
              active={f.timeSlots.includes(slot)}
              onClick={() => set({ timeSlots: toggle(f.timeSlots, slot) })}
            >
              <TimeSlotIcon slot={slot} size={12} />
              {TIME_SLOT_LABELS[slot]}
            </ToggleChip>
          ))}
        </div>
      </div>

      {/* 開課狀態 */}
      <div>
        <SectionTitle>開課狀態</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {ALL_STATUSES.map((s) => (
            <CheckItem
              key={s}
              checked={f.statuses.includes(s)}
              onClick={() => set({ statuses: toggle(f.statuses, s) })}
            >
              {STATUS_INFO[s].label}
            </CheckItem>
          ))}
        </div>
      </div>

      {/* 類別 */}
      {availableCategories.length > 0 && (
        <div>
          <SectionTitle>課程類別</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', maxHeight: 180, overflowY: 'auto' }}>
            {availableCategories.map((cat) => (
              <CheckItem
                key={cat}
                checked={f.categories.includes(cat)}
                onClick={() => set({ categories: toggle(f.categories, cat) })}
              >
                {cat}
              </CheckItem>
            ))}
          </div>
        </div>
      )}

      {/* 特殊標記 */}
      <div>
        <SectionTitle>特殊標記</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <CheckItem checked={f.onlyNew} onClick={() => set({ onlyNew: !f.onlyNew })}>
            僅顯示新課程
          </CheckItem>
          <CheckItem
            checked={!f.excludeSpring}
            onClick={() => {
              const next = !f.excludeSpring;
              set({
                excludeSpring: !next,
                semesters: !next ? f.semesters.filter((s) => !s.includes('春')) : f.semesters,
              });
            }}
          >
            顯示春季班
          </CheckItem>
        </div>
      </div>
    </div>
  );
}
