import { DailyIcon, MonthlyIcon, HistoryIcon, TasksIcon, SettingsIcon } from '../icons/TabIcons'

const TABS = [
  { label: 'Daily',    Icon: DailyIcon },
  { label: 'Monthly',  Icon: MonthlyIcon },
  { label: 'History',  Icon: HistoryIcon },
  { label: 'Tasks',    Icon: TasksIcon },
  { label: 'Settings', Icon: SettingsIcon },
]

interface Props {
  active: number
  onSelect: (i: number) => void
}

export function BottomNav({ active, onSelect }: Props) {
  return (
    <nav style={{
      display: 'flex',
      borderTop: '1px solid rgba(244,183,64,0.12)',
      background: '#000',
      paddingBottom: 'env(safe-area-inset-bottom)',
    }}>
      {TABS.map(({ label, Icon }, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          style={{
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', gap: 3, padding: '10px 0',
            background: 'transparent', border: 'none', cursor: 'pointer',
          }}
        >
          <Icon active={active === i} />
          <span style={{
            fontSize: 9, fontWeight: 600, letterSpacing: 0.5,
            color: active === i ? 'var(--accent)' : 'rgba(255,255,255,0.38)',
          }}>
            {label.toUpperCase()}
          </span>
        </button>
      ))}
    </nav>
  )
}
