import { useApp } from '../context/AppContext'
import { monthKey, isTaskDone } from '../core/helpers'
import { MonthNav } from '../components/nav/MonthNav'
import { TaskCard } from '../components/taskcard/TaskCard'
import { ProgressStrip } from '../components/shared/ProgressStrip'
import type { TaskEntry } from '../core/models'

interface Props {
  date: Date
  onDateChange: (d: Date) => void
}

export function MonthlyPage({ date, onDateChange }: Props) {
  const { tasks, log, showProgressBar, updateEntry } = useApp()
  const mk = monthKey(date)
  const monthLog = log[mk]
  const monthlyTasks = tasks.filter(t => t.frequency === 'monthly')
  const doneTasks = monthlyTasks.filter(t => isTaskDone(t, monthLog?.[t.id]))

  function handleChange(taskId: string, entry: TaskEntry | null) {
    updateEntry(mk, taskId, entry)
  }

  return (
    <div style={{ paddingBottom: 16 }}>
      <MonthNav date={date} onDateChange={onDateChange} />
      {showProgressBar && monthlyTasks.length > 0 && (
        <ProgressStrip done={doneTasks.length} total={monthlyTasks.length} />
      )}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {monthlyTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-faint)' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
            <p>No monthly tasks yet.</p>
            <p style={{ fontSize: 13 }}>Add tasks in the Tasks tab.</p>
          </div>
        ) : (
          monthlyTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              entry={monthLog?.[task.id]}
              onChange={entry => handleChange(task.id, entry)}
            />
          ))
        )}
      </div>
    </div>
  )
}
