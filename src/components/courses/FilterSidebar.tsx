import type { CourseStatus, TimeSlot } from '@/types/course';
import { getSchoolInfo, DAY_LABELS, TIME_SLOT_LABELS, STATUS_INFO } from '@/lib/courseUtils';

export interface FilterState {
  search: string;
  schools: string[];
  days: number[];
  timeSlots: TimeSlot[];
  categories: string[];
  statuses: CourseStatus[];
  onlyNew: boolean;
  onlyMixed: boolean;
  sortBy: 'date' | 'fee-asc' | 'fee-desc' | 'school';
}

export const DEFAULT_FILTERS: FilterState = {
  search: '', schools: [], days: [], timeSlots: [],
  categories: [], statuses: [], onlyNew: false, onlyMixed: false, sortBy: 'date',
};

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  availableSchools: string[];
  availableCategories: string[];
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

export function FilterSidebar({ filters, onChange, availableSchools, availableCategories, embedded }: FilterSidebarProps) {
  const f = filters;
  const set = (partial: Partial<FilterState>) => onChange({ ...f, ...partial });

  const activeCount = [
    f.schools.length, f.days.length, f.timeSlots.length, f.categories.length,
    f.statuses.length, f.onlyNew ? 1 : 0, f.onlyMixed ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

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

      {/* 學校 */}
      {availableSchools.length > 0 && (
        <div>
          <SectionTitle>學校</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {availableSchools.map((school) => {
              const info = getSchoolInfo(school);
              return (
                <CheckItem
                  key={school}
                  checked={f.schools.includes(school)}
                  onClick={() => set({ schools: toggle(f.schools, school) })}
                >
                  <span style={{
                    display: 'inline-block', width: 8, height: 8, borderRadius: '50%',
                    background: info.color, marginRight: 2,
                  }} />
                  {info.name}
                </CheckItem>
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
          {([['onlyNew', '僅顯示新課程'], ['onlyMixed', '僅顯示混成課程']] as const).map(([key, label]) => (
            <CheckItem key={key} checked={f[key]} onClick={() => set({ [key]: !f[key] })}>
              {label}
            </CheckItem>
          ))}
        </div>
      </div>
    </div>
  );
}
