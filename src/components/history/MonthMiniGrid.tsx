import type { Task, LogMap } from '../../core/models'
import { completionLevel, dateKey, monthKey } from '../../core/helpers'
import { cellColor } from '../../core/theme'

const CELL = 10
const GAP = 2

interface Props {
  task: Task
  log: LogMap
  year: number
  month: number // 0-indexed
}

export function MonthMiniGrid({ task, log, year, month }: Props) {
  const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const today = new Date()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  if (task.frequency === 'monthly') {
    const mk = monthKey(new Date(year, month, 1))
    const level = completionLevel(task, log[mk]?.[task.id])
    const bg = cellColor(level, task.color)
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
        <div style={{ fontSize: 10, color: 'var(--text-faint)' }}>{SHORT_MONTHS[month]} {year}</div>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)' }}>{level > 0 ? '✓' : ''}</span>
        </div>
      </div>
    )
  }

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let i = 1; i <= daysInMonth; i++) cells.push(i)

  return (
    <div>
      <div style={{ fontSize: 10, color: 'var(--text-faint)', marginBottom: 4 }}>
        {SHORT_MONTHS[month]} {year}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, ${CELL}px)`, gap: GAP }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} style={{ width: CELL, height: CELL }} />
          const cellDate = new Date(year, month, d)
          const isFuture = cellDate > today
          const key = dateKey(cellDate)
          const level = isFuture ? -1 : completionLevel(task, log[key]?.[task.id])
          return (
            <div key={i} style={{
              width: CELL, height: CELL, borderRadius: 2,
              background: level < 0 ? 'transparent' : cellColor(level, task.color),
            }} />
          )
        })}
      </div>
    </div>
  )
}
