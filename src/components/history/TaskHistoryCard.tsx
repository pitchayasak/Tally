import type { Task, LogMap } from '../../core/models'
import { taskTypeLabel } from '../../core/helpers'
import { CalendarGrid } from './CalendarGrid'
import { StatsRow } from './StatsRow'
import type { TaskFrequency } from '../../core/models'

interface Props {
  task: Task
  log: LogMap
  onNameClick: (task: Task) => void
  onCellPress: (date: Date, freq: TaskFrequency) => void
}

export function TaskHistoryCard({ task, log, onNameClick, onCellPress }: Props) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid rgba(244,183,64,0.1)',
      borderRadius: 14,
      overflow: 'hidden',
    }}>
      <div style={{ padding: '14px 16px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 4, height: 32, borderRadius: 2, background: task.color, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, color: 'var(--text-faint)', letterSpacing: 1 }}>
            {taskTypeLabel(task)}
          </div>
          <button
            onClick={() => onNameClick(task)}
            style={{
              background: 'none', border: 'none', padding: 0,
              color: '#fff', fontSize: 15, fontWeight: 600,
              cursor: 'pointer', textAlign: 'left',
              textDecoration: 'underline', textDecorationColor: 'rgba(255,255,255,0.2)',
            }}
          >
            {task.name}
          </button>
        </div>
      </div>
      <div style={{ padding: '0 16px 12px' }}>
        <CalendarGrid
          task={task}
          log={log}
          onCellPress={d => onCellPress(d, task.frequency)}
        />
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <StatsRow task={task} log={log} />
      </div>
    </div>
  )
}
