import { useState } from 'react'
import type { Task, LogMap } from '../../core/models'
import { completionLevel, dateKey, monthKey, addDays, addMonths, isSameDay, isSameMonth, formatShortDate } from '../../core/helpers'
import { cellColor } from '../../core/theme'

const COLS = 18
const ROWS = 7
const CELL = 14
const GAP = 3

const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

interface Props {
  task: Task
  log: LogMap
  onCellPress?: (date: Date) => void
}

interface TooltipState {
  label: string
  x: number
  y: number
}

// ─── Monthly strip (one block per month) ────────────────────────────────────

const MO_BLOCK = 22
const MO_GAP = 3
const MO_COUNT = 18

function MonthlyStrip({ task, log, onCellPress }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const today = new Date()

  const blocks = Array.from({ length: MO_COUNT }, (_, i) => {
    const d = addMonths(today, -(MO_COUNT - 1 - i))
    const mk = monthKey(d)
    const level = completionLevel(task, log[mk]?.[task.id])
    const isCurrent = isSameMonth(d, today)
    const showYear = d.getMonth() === 0 || i === 0
    return { date: d, level, isCurrent, showYear }
  })

  return (
    <div
      style={{ overflowX: 'auto', paddingBottom: 4 }}
      onMouseLeave={() => setTooltip(null)}
    >
      {tooltip && (
        <div style={{
          position: 'fixed',
          left: tooltip.x, top: tooltip.y,
          transform: 'translate(-50%, -100%)',
          marginTop: -6,
          background: '#222',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 6, padding: '4px 8px',
          fontSize: 11, fontWeight: 600, color: '#fff',
          pointerEvents: 'none', whiteSpace: 'nowrap',
          zIndex: 999, boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        }}>
          {tooltip.label}
        </div>
      )}

      <div style={{ display: 'flex', gap: MO_GAP, alignItems: 'flex-end' }}>
        {blocks.map(({ date, level, isCurrent, showYear }, i) => {
          const bg = cellColor(level, task.color)
          const clickable = !!onCellPress
          const label = `${SHORT_MONTHS[date.getMonth()]} ${date.getFullYear()}`

          return (
            <div
              key={i}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}
            >
              {/* Year label — show at January or first block */}
              <span style={{
                fontSize: 8, color: showYear ? 'var(--text-faint)' : 'transparent',
                letterSpacing: 0.3, lineHeight: 1,
              }}>
                {date.getFullYear()}
              </span>

              {/* Month block */}
              <div
                onClick={e => {
                  if (!clickable) return
                  e.stopPropagation()
                  setTooltip(null)
                  onCellPress!(date)
                }}
                onMouseEnter={e => {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                  setTooltip({ label, x: rect.left + rect.width / 2, y: rect.top })
                }}
                onMouseOver={e => {
                  if (clickable) (e.currentTarget as HTMLElement).style.opacity = '0.75'
                }}
                onMouseOut={e => {
                  (e.currentTarget as HTMLElement).style.opacity = '1'
                }}
                style={{
                  width: MO_BLOCK, height: MO_BLOCK,
                  borderRadius: 5,
                  background: bg,
                  outline: isCurrent ? `1.5px solid ${task.color}88` : 'none',
                  cursor: clickable ? 'pointer' : 'default',
                  transition: 'opacity 0.1s',
                }}
              />

              {/* Month label */}
              <span style={{ fontSize: 9, color: 'var(--text-faint)', lineHeight: 1 }}>
                {SHORT_MONTHS[date.getMonth()]}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Daily grid (18 weeks × 7 days) ─────────────────────────────────────────

function DailyGrid({ task, log, onCellPress }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)
  const today = new Date()
  const dayOfWeek = today.getDay()
  const endSat = addDays(today, 6 - dayOfWeek)

  const monthLabels: { label: string; col: number }[] = []
  const grid: { date: Date; level: number }[][] = []

  for (let col = 0; col < COLS; col++) {
    const colCells: { date: Date; level: number }[] = []
    for (let row = 0; row < ROWS; row++) {
      const daysBack = (COLS - 1 - col) * 7 + (6 - row)
      const d = addDays(endSat, -daysBack)
      const isFuture = d > today
      const level = isFuture ? -1 : completionLevel(task, log[dateKey(d)]?.[task.id])

      if (!isFuture && d.getDate() === 1 && row === 0) {
        monthLabels.push({ label: SHORT_MONTHS[d.getMonth()], col })
      } else if (!isFuture && row === 0 && col === 0) {
        monthLabels.push({ label: SHORT_MONTHS[d.getMonth()], col: 0 })
      }

      colCells.push({ date: d, level })
    }
    grid.push(colCells)
  }

  const totalW = COLS * (CELL + GAP) - GAP

  return (
    <div
      style={{ overflowX: 'auto', paddingBottom: 4 }}
      onMouseLeave={() => setTooltip(null)}
    >
      {tooltip && (
        <div style={{
          position: 'fixed',
          left: tooltip.x, top: tooltip.y,
          transform: 'translate(-50%, -100%)',
          marginTop: -6,
          background: '#222',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 6, padding: '4px 8px',
          fontSize: 11, fontWeight: 600, color: '#fff',
          pointerEvents: 'none', whiteSpace: 'nowrap',
          zIndex: 999, boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
        }}>
          {tooltip.label}
        </div>
      )}

      <div style={{ width: totalW }}>
        {/* Month labels row */}
        <div style={{ display: 'flex', height: 14, marginBottom: 2 }}>
          {grid.map((_, col) => {
            const m = monthLabels.find(e => e.col === col)
            return (
              <div key={col} style={{ width: CELL + GAP, flexShrink: 0 }}>
                {m && <span style={{ fontSize: 9, color: 'var(--text-faint)', letterSpacing: 0.5 }}>{m.label}</span>}
              </div>
            )
          })}
        </div>

        {/* Cell grid */}
        <div style={{ display: 'flex', gap: GAP }}>
          {grid.map((col, ci) => (
            <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
              {col.map(({ date, level }, ri) => {
                const isTo = isSameDay(date, today)
                const clickable = level >= 0 && !!onCellPress
                return (
                  <div
                    key={ri}
                    onClick={e => {
                      if (!clickable) return
                      e.stopPropagation()
                      setTooltip(null)
                      onCellPress!(date)
                    }}
                    onMouseEnter={e => {
                      if (level < 0) return
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                      setTooltip({ label: formatShortDate(date), x: rect.left + rect.width / 2, y: rect.top })
                    }}
                    onMouseOver={e => {
                      if (clickable) (e.currentTarget as HTMLElement).style.opacity = '0.75'
                    }}
                    onMouseOut={e => {
                      (e.currentTarget as HTMLElement).style.opacity = '1'
                    }}
                    style={{
                      width: CELL, height: CELL, borderRadius: 3,
                      background: level < 0 ? 'transparent' : cellColor(level, task.color),
                      outline: isTo ? `1.5px solid ${task.color}88` : 'none',
                      cursor: clickable ? 'pointer' : 'default',
                      transition: 'opacity 0.1s',
                    }}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Public component ────────────────────────────────────────────────────────

export function CalendarGrid(props: Props) {
  if (props.task.frequency === 'monthly') {
    return <MonthlyStrip {...props} />
  }
  return <DailyGrid {...props} />
}
