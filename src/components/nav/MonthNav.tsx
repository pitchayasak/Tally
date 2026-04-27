import { addMonths, formatMonthLabel, isSameMonth } from '../../core/helpers'

interface Props {
  date: Date
  onDateChange: (d: Date) => void
}

export function MonthNav({ date, onDateChange }: Props) {
  const today = new Date()
  const isCurrentMonth = isSameMonth(date, today)

  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '14px 16px 8px', gap: 8 }}>
      <button
        onClick={() => onDateChange(addMonths(date, -1))}
        style={arrowBtn}
      >‹</button>
      <div style={{ flex: 1, textAlign: 'center', fontWeight: 600, fontSize: 16 }}>
        {formatMonthLabel(date)}
      </div>
      <button
        onClick={() => onDateChange(addMonths(date, 1))}
        disabled={isCurrentMonth}
        style={{ ...arrowBtn, opacity: isCurrentMonth ? 0.3 : 1 }}
      >›</button>
      {!isCurrentMonth && (
        <button
          onClick={() => onDateChange(new Date())}
          style={{
            padding: '4px 8px', background: 'var(--accent-faint)',
            border: '1px solid var(--accent-dim)', borderRadius: 6,
            color: 'var(--accent)', fontSize: 11, fontWeight: 700,
            cursor: 'pointer', letterSpacing: 0.5,
          }}
        >NOW</button>
      )}
    </div>
  )
}

const arrowBtn: React.CSSProperties = {
  width: 36, height: 36, background: 'transparent',
  border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8,
  color: '#fff', fontSize: 22, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
}
