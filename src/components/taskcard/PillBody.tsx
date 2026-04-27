import type { Task, PillEntry } from '../../core/models'
import { GlowToggle } from '../shared/GlowToggle'

interface Props {
  task: Task
  entry: PillEntry | null | undefined
  onChange: (e: PillEntry) => void
}

export function PillBody({ task, entry, onChange }: Props) {
  const morning = entry?.morning ?? false
  const evening = entry?.evening ?? false

  return (
    <div style={{ display: 'flex', gap: 8, padding: '0 16px 16px' }}>
      <GlowToggle
        label="Morning"
        active={morning}
        color={task.color}
        onClick={() => onChange({ morning: !morning, evening })}
      />
      <GlowToggle
        label="Evening"
        active={evening}
        color={task.color}
        onClick={() => onChange({ morning, evening: !evening })}
      />
    </div>
  )
}
