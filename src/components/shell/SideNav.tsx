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

export function SideNav({ active, onSelect }: Props) {
  return (
    <nav style={{
      width: 200,
      flexShrink: 0,
      background: '#0d0d0d',
      borderRight: '1px solid rgba(255,255,255,0.07)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{
        padding: '24px 20px 32px',
        fontSize: 20,
        fontWeight: 800,
        letterSpacing: 2,
        color: 'var(--accent)',
      }}>
        TALLY
      </div>

      {TABS.map(({ label, Icon }, i) => {
        const isActive = active === i
        return (
          <button
            key={i}
            onClick={() => onSelect(i)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '13px 20px',
              background: isActive ? 'rgba(244,183,64,0.08)' : 'transparent',
              border: 'none',
              borderLeft: `3px solid ${isActive ? 'var(--accent)' : 'transparent'}`,
              color: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.45)',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: isActive ? 700 : 400,
              width: '100%',
              textAlign: 'left',
              transition: 'background 0.15s, color 0.15s',
            }}
            onMouseEnter={e => {
              if (!isActive) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'
            }}
            onMouseLeave={e => {
              if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'
            }}
          >
            <Icon active={isActive} />
            {label}
          </button>
        )
      })}
    </nav>
  )
}
