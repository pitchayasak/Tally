import type { TaskFrequency } from '../../core/models'

export function FreqBadge({ freq }: { freq: TaskFrequency }) {
  return (
    <span style={{
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: 1,
      color: 'var(--accent)',
      border: '1px solid var(--accent-dim)',
      borderRadius: 3,
      padding: '1px 4px',
    }}>
      {freq === 'daily' ? 'DAILY' : 'MONTHLY'}
    </span>
  )
}
