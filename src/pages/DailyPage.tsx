import { useApp } from '../context/AppContext'
import { dateKey, isTaskDone } from '../core/helpers'
import { DateNav } from '../components/nav/DateNav'
import { TaskCard } from '../components/taskcard/TaskCard'
import { ProgressStrip } from '../components/shared/ProgressStrip'
import type { TaskEntry } from '../core/models'

interface Props {
  date: Date
  onDateChange: (d: Date) => void
}

export function DailyPage({ date, onDateChange }: Props) {
  const { tasks, log, showProgressBar, updateEntry } = useApp()
  const dk = dateKey(date)
  const dayLog = log[dk]
  const dailyTasks = tasks.filter(t => t.frequency === 'daily')
  const doneTasks = dailyTasks.filter(t => isTaskDone(t, dayLog?.[t.id]))

  function handleChange(taskId: string, entry: TaskEntry | null) {
    updateEntry(dk, taskId, entry)
  }

  return (
    <div style={{ paddingBottom: 16 }}>
      <DateNav date={date} onDateChange={onDateChange} />
      {showProgressBar && dailyTasks.length > 0 && (
        <ProgressStrip done={doneTasks.length} total={dailyTasks.length} />
      )}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {dailyTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-faint)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📋</div>
            <p>No daily tasks yet.</p>
            <p style={{ fontSize: 13 }}>Add tasks in the Tasks tab.</p>
          </div>
        ) : (
          dailyTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              entry={dayLog?.[task.id]}
              onChange={entry => handleChange(task.id, entry)}
            />
          ))
        )}
      </div>
    </div>
  )
}
