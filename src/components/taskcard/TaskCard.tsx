import type { Task, TaskEntry, PillEntry, ExerciseEntry, TransferEntry, SpendEntry } from '../../core/models'
import { CardHeader } from './CardHeader'
import { PillBody } from './PillBody'
import { ExerciseBody } from './ExerciseBody'
import { TransferBody } from './TransferBody'
import { SpendBody } from './SpendBody'

interface Props {
  task: Task
  entry: TaskEntry | null | undefined
  onChange: (entry: TaskEntry | null) => void
}

export function TaskCard({ task, entry, onChange }: Props) {
  return (
    <div style={{
      background: 'var(--card)',
      border: '1px solid rgba(244,183,64,0.1)',
      borderRadius: 14,
      overflow: 'hidden',
    }}>
      <CardHeader task={task} entry={entry} />
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
      {task.type === 'pill' && (
        <PillBody
          task={task}
          entry={entry as PillEntry | null | undefined}
          onChange={e => onChange(e.morning === false && e.evening === false ? null : e)}
        />
      )}
      {task.type === 'exercise' && (
        <ExerciseBody
          task={task}
          entry={entry as ExerciseEntry | null | undefined}
          onChange={e => onChange(e.duration == null && e.distance == null ? null : e)}
        />
      )}
      {task.type === 'transfer' && (
        <TransferBody
          task={task}
          entry={entry as TransferEntry | null | undefined}
          onChange={e => onChange(e)}
        />
      )}
      {task.type === 'spend' && (
        <SpendBody
          task={task}
          entry={entry as SpendEntry | null | undefined}
          onChange={e => onChange(e)}
        />
      )}
    </div>
  )
}
