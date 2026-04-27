import { useState } from 'react'
import { formatLongDate, addDays, isSameDay } from '../../core/helpers'

interface Props {
  date: Date
  onDateChange: (d: Date) => void
}

export function DateNav({ date, onDateChange }: Props) {
  const [showPicker, setShowPicker] = useState(false)
  const today = new Date()
  const isToday = isSameDay(date, today)

  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', padding: '14px 16px 8px',
        gap: 8,
      }}>
        <button
          onClick={() => onDateChange(addDays(date, -1))}
          style={arrowBtn}
        >‹</button>
        <button
          onClick={() => setShowPicker(true)}
          style={{
            flex: 1, background: 'transparent', border: 'none',
            color: '#fff', fontSize: 16, fontWeight: 600, cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          {formatLongDate(date)}
        </button>
        <button
          onClick={() => onDateChange(addDays(date, 1))}
          disabled={isToday}
          style={{ ...arrowBtn, opacity: isToday ? 0.3 : 1 }}
        >›</button>
        {!isToday && (
          <button
            onClick={() => onDateChange(new Date())}
            style={{
              padding: '4px 10px', background: 'var(--accent-faint)',
              border: '1px solid var(--accent-dim)', borderRadius: 6,
              color: 'var(--accent)', fontSize: 11, fontWeight: 700,
              cursor: 'pointer', letterSpacing: 0.5,
            }}
          >TODAY</button>
        )}
      </div>
      {showPicker && (
        <CalendarPickerSheet date={date} onSelect={d => { onDateChange(d); setShowPicker(false) }} onClose={() => setShowPicker(false)} />
      )}
    </>
  )
}

const arrowBtn: React.CSSProperties = {
  width: 36, height: 36, background: 'transparent',
  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8,
  color: '#fff', fontSize: 22, cursor: 'pointer', lineHeight: 1,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}

function CalendarPickerSheet({ date, onSelect, onClose }: {
  date: Date
  onSelect: (d: Date) => void
  onClose: () => void
}) {
  const [view, setView] = useState(new Date(date.getFullYear(), date.getMonth(), 1))
  const today = new Date()

  const year = view.getFullYear()
  const month = view.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let i = 1; i <= daysInMonth; i++) cells.push(i)

  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <div
        style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 430, background: '#111',
          borderRadius: '16px 16px 0 0', padding: 20,
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <button onClick={() => setView(new Date(year, month - 1, 1))} style={arrowBtn}>‹</button>
          <div style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: 16 }}>
            {MONTHS[month]} {year}
          </div>
          <button
            onClick={() => setView(new Date(year, month + 1, 1))}
            disabled={year === today.getFullYear() && month >= today.getMonth()}
            style={{ ...arrowBtn, opacity: (year === today.getFullYear() && month >= today.getMonth()) ? 0.3 : 1 }}
          >›</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 10, color: 'var(--text-faint)', padding: '4px 0' }}>{d}</div>
          ))}
          {cells.map((d, i) => {
            if (!d) return <div key={i} />
            const cellDate = new Date(year, month, d)
            const isSelected = cellDate.toDateString() === date.toDateString()
            const isFuture = cellDate > today
            return (
              <button
                key={i}
                disabled={isFuture}
                onClick={() => onSelect(cellDate)}
                style={{
                  aspectRatio: '1', borderRadius: '50%',
                  background: isSelected ? 'var(--accent)' : 'transparent',
                  border: 'none',
                  color: isSelected ? '#000' : isFuture ? 'var(--text-faint)' : '#fff',
                  fontSize: 13, fontWeight: isSelected ? 700 : 400, cursor: isFuture ? 'default' : 'pointer',
                }}
              >{d}</button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
