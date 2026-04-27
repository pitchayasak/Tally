import type { Task, TaskEntry } from '../../core/models'
import { completionLevel, taskTypeLabel } from '../../core/helpers'
import { PillIcon } from '../icons/PillIcon'
import { ExerciseIcon } from '../icons/ExerciseIcon'
import { MoneyIcon } from '../icons/MoneyIcon'
import { CompletionDot } from '../shared/CompletionDot'

interface Props {
  task: Task
  entry: TaskEntry | null | undefined
}

export function CardHeader({ task, entry }: Props) {
  const level = completionLevel(task, entry)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px 10px' }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: `${task.color}1A`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {task.type === 'pill' && <PillIcon color={task.color} />}
        {task.type === 'exercise' && <ExerciseIcon icon={task.icon} color={task.color} />}
        {(task.type === 'transfer' || task.type === 'spend') && <MoneyIcon type={task.type} color={task.color} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, color: 'var(--text-faint)', letterSpacing: 1, marginBottom: 2 }}>
          {taskTypeLabel(task)}
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {task.name}
        </div>
      </div>
      <CompletionDot level={level} color={task.color} size={12} />
    </div>
  )
}
