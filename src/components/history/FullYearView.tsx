import type { Task, LogMap } from '../../core/models'
import { MonthMiniGrid } from './MonthMiniGrid'

interface Props {
  task: Task
  log: LogMap
  onClose: () => void
}

export function FullYearView({ task, log, onClose }: Props) {
  const today = new Date()
  const year = today.getFullYear()

  const months = Array.from({ length: 12 }, (_, i) => ({ year, month: i }))

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 50,
      background: '#000',
      overflowY: 'auto',
      paddingBottom: 32,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 16px 12px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        position: 'sticky', top: 0, background: '#000', zIndex: 10,
      }}>
        <button
          onClick={onClose}
          style={{
            background: 'transparent', border: 'none',
            color: 'var(--accent)', fontSize: 15, cursor: 'pointer', padding: '4px 0',
          }}
        >‹ Back</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{task.name}</div>
          <div style={{ fontSize: 11, color: 'var(--text-sub)' }}>Full year {year}</div>
        </div>
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gap: 24,
        padding: 20,
      }}>
        {months.map(({ year: y, month: m }) => (
          <MonthMiniGrid key={m} task={task} log={log} year={y} month={m} />
        ))}
      </div>
    </div>
  )
}
