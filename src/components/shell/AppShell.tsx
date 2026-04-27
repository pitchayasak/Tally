import { useState, useCallback } from 'react'
import { BottomNav } from './BottomNav'
import { SideNav } from './SideNav'
import { useIsWide } from '../../hooks/useIsWide'
import { DailyPage } from '../../pages/DailyPage'
import { MonthlyPage } from '../../pages/MonthlyPage'
import { HistoryPage } from '../../pages/HistoryPage'
import { TasksPage } from '../../pages/TasksPage'
import { SettingsPage } from '../../pages/SettingsPage'
import type { TaskFrequency } from '../../core/models'

export interface ShellNav {
  goToDate: (date: Date, freq: TaskFrequency) => void
}

export function AppShell() {
  const [tab, setTab] = useState(0)
  const [dailyDate, setDailyDate] = useState(new Date())
  const [monthlyDate, setMonthlyDate] = useState(new Date())
  const isWide = useIsWide()

  const goToDate = useCallback((date: Date, freq: TaskFrequency) => {
    if (freq === 'daily') {
      setDailyDate(date)
      setTab(0)
    } else {
      setMonthlyDate(date)
      setTab(1)
    }
  }, [])

  const pages = [
    <DailyPage key="daily" date={dailyDate} onDateChange={setDailyDate} />,
    <MonthlyPage key="monthly" date={monthlyDate} onDateChange={setMonthlyDate} />,
    <HistoryPage key="history" onGoToDate={goToDate} />,
    <TasksPage key="tasks" />,
    <SettingsPage key="settings" />,
  ]

  if (isWide) {
    return (
      <div style={{ display: 'flex', height: '100dvh', background: '#000' }}>
        <SideNav active={tab} onSelect={setTab} />
        <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
          {pages.map((page, i) => (
            <div
              key={i}
              style={{
                position: 'absolute', inset: 0, overflowY: 'auto',
                visibility: tab === i ? 'visible' : 'hidden',
                pointerEvents: tab === i ? 'auto' : 'none',
              }}
            >
              <div style={{ maxWidth: 860, padding: '0 8px 32px' }}>
                {page}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', maxWidth: 430, margin: '0 auto' }}>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {pages.map((page, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0, overflow: 'auto',
            visibility: tab === i ? 'visible' : 'hidden',
            pointerEvents: tab === i ? 'auto' : 'none',
          }}>
            {page}
          </div>
        ))}
      </div>
      <BottomNav active={tab} onSelect={setTab} />
    </div>
  )
}
