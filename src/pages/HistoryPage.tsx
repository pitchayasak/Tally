import { useState, useEffect } from 'react'
import { useApp, historyDailyRange, historyMonthlyRange } from '../context/AppContext'
import { TaskHistoryCard } from '../components/history/TaskHistoryCard'
import { FullYearView } from '../components/history/FullYearView'
import { ConfirmDialog } from '../components/shared/ConfirmDialog'
import { formatLongDate, formatMonthLabel } from '../core/helpers'
import type { Task, TaskFrequency } from '../core/models'

interface Props {
  onGoToDate: (date: Date, freq: TaskFrequency) => void
}

interface PendingNav {
  date: Date
  freq: TaskFrequency
}

export function HistoryPage({ onGoToDate }: Props) {
  const { tasks, log, loadLogRangeIntoCache } = useApp()
  const [fullYearTask, setFullYearTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)
  const [pendingNav, setPendingNav] = useState<PendingNav | null>(null)

  useEffect(() => {
    const { from: df, to: dt } = historyDailyRange()
    const { from: mf, to: mt } = historyMonthlyRange()
    Promise.all([
      loadLogRangeIntoCache(df, dt),
      loadLogRangeIntoCache(mf, mt),
    ]).finally(() => setLoading(false))
  }, [loadLogRangeIntoCache])

  function handleCellPress(date: Date, freq: TaskFrequency) {
    setPendingNav({ date, freq })
  }

  function handleConfirmNav() {
    if (!pendingNav) return
    onGoToDate(pendingNav.date, pendingNav.freq)
    setPendingNav(null)
  }

  function navLabel(nav: PendingNav): string {
    if (nav.freq === 'monthly') return formatMonthLabel(nav.date)
    return formatLongDate(nav.date)
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
        <div style={{ color: 'var(--text-sub)' }}>Loading history…</div>
      </div>
    )
  }

  return (
    <>
      <div style={{ paddingBottom: 16 }}>
        <div style={{ padding: '18px 16px 10px' }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>History</h2>
          <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--text-sub)' }}>Last 18 weeks</p>
        </div>
        <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-faint)' }}>
              <p>No tasks to show history for.</p>
            </div>
          ) : (
            tasks.map(task => (
              <TaskHistoryCard
                key={task.id}
                task={task}
                log={log}
                onNameClick={t => setFullYearTask(t)}
                onCellPress={(date, freq) => handleCellPress(date, freq)}
              />
            ))
          )}
        </div>
      </div>

      {fullYearTask && (
        <FullYearView
          task={fullYearTask}
          log={log}
          onClose={() => setFullYearTask(null)}
        />
      )}

      {pendingNav && (
        <ConfirmDialog
          title={`Go to ${navLabel(pendingNav)}?`}
          message={`Open the ${pendingNav.freq === 'monthly' ? 'Monthly' : 'Daily'} tab and jump to ${navLabel(pendingNav)}.`}
          confirmLabel="Go"
          onConfirm={handleConfirmNav}
          onCancel={() => setPendingNav(null)}
        />
      )}
    </>
  )
}
