import type { Task } from '../../core/models'
import type { LogMap } from '../../core/models'
import { completionLevel, dateKey, monthKey, addDays, addMonths } from '../../core/helpers'

interface Props {
  task: Task
  log: LogMap
}

export function StatsRow({ task, log }: Props) {
  const { streak, best, total } = calcStats(task, log)
  return (
    <div style={{ display: 'flex', gap: 0 }}>
      {[['Streak', streak], ['Best', best], ['Total', total]].map(([label, val]) => (
        <div key={label as string} style={{ flex: 1, textAlign: 'center', padding: '8px 0' }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: task.color }}>{val}</div>
          <div style={{ fontSize: 10, color: 'var(--text-faint)', letterSpacing: 1 }}>{label as string}</div>
        </div>
      ))}
    </div>
  )
}

function calcStats(task: Task, log: LogMap) {
  const today = new Date()
  const isMo = task.frequency === 'monthly'
  const steps = isMo ? 17 : 125

  let best = 0, total = 0, cur = 0, streak = 0

  for (let i = steps; i >= 0; i--) {
    const d = isMo ? addMonths(today, -i) : addDays(today, -i)
    const key = isMo ? monthKey(d) : dateKey(d)
    const level = completionLevel(task, log[key]?.[task.id])
    const done = isMo ? level >= 2 : level > 0
    if (done) { cur++; total++; if (cur > best) best = cur }
    else cur = 0
  }

  for (let i = 0; i < steps + 1; i++) {
    const d = isMo ? addMonths(today, -i) : addDays(today, -i)
    const key = isMo ? monthKey(d) : dateKey(d)
    const level = completionLevel(task, log[key]?.[task.id])
    const done = isMo ? level >= 2 : level > 0
    if (done) streak++
    else { if (i === 0) continue; break }
  }

  return { streak, best, total }
}
