import type { Task, ExerciseEntry } from '../../core/models'
import { ChoiceChip } from '../shared/ChoiceChip'

const DURATION_OPTS = [15, 20, 30, 40, 45, 50, 60]
const DISTANCE_OPTS = [500, 1000, 1500, 2000]

function distanceLabel(m: number): string {
  return m >= 1000 ? `${m / 1000}km` : `${m}m`
}

interface Props {
  task: Task
  entry: ExerciseEntry | null | undefined
  onChange: (e: ExerciseEntry) => void
}

export function ExerciseBody({ task, entry, onChange }: Props) {
  if (task.mode === 'distance') {
    const active = entry?.distance ?? null
    return (
      <div style={{ display: 'flex', gap: 6, padding: '0 16px 16px', flexWrap: 'wrap' }}>
        {DISTANCE_OPTS.map(d => (
          <ChoiceChip
            key={d}
            label={distanceLabel(d)}
            active={active === d}
            color={task.color}
            onClick={() => onChange({ distance: active === d ? undefined : d })}
          />
        ))}
      </div>
    )
  }
  const active = entry?.duration ?? null
  return (
    <div style={{ display: 'flex', gap: 6, padding: '0 16px 16px', flexWrap: 'wrap' }}>
      {DURATION_OPTS.map(d => (
        <ChoiceChip
          key={d}
          label={`${d}min`}
          active={active === d}
          color={task.color}
          onClick={() => onChange({ duration: active === d ? undefined : d })}
        />
      ))}
    </div>
  )
}
