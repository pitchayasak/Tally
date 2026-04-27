import { useState, useRef } from 'react'
import type { Task, SpendEntry } from '../../core/models'

interface Props {
  task: Task
  entry: SpendEntry | null | undefined
  onChange: (e: SpendEntry | null) => void
}

function sanitize(s: string): string {
  let v = s.replace(/[^0-9.]/g, '')
  const dot = v.indexOf('.')
  if (dot >= 0) {
    v = v.slice(0, dot + 1) + v.slice(dot + 1).replace(/\./g, '')
  }
  const parts = v.split('.')
  let intPart = parts[0].replace(/^0+/, '') || (parts[0] === '' ? '' : '0')
  if (intPart.length > 6) intPart = intPart.slice(0, 6)
  if (parts.length > 1) {
    const dec = parts[1].slice(0, 2)
    return `${intPart}.${dec}`
  }
  return intPart
}

export function SpendBody({ task, entry, onChange }: Props) {
  const initRaw = entry?.amount != null ? fmt(entry.amount) : ''
  const [raw, setRaw] = useState(initRaw)
  const inputRef = useRef<HTMLInputElement>(null)

  const hasValue = raw !== '' && raw !== '.'

  function handleChange(s: string) {
    const v = sanitize(s)
    setRaw(v)

    // Sync cursor after sanitize
    if (inputRef.current && v !== s) {
      const pos = v.length
      requestAnimationFrame(() => {
        inputRef.current?.setSelectionRange(pos, pos)
      })
    }

    const parsed = parseFloat(v)
    if (v && !isNaN(parsed)) onChange({ amount: parsed })
    else onChange(null)
  }

  function handleBlur() {
    if (raw.endsWith('.')) {
      const trimmed = raw.slice(0, -1)
      setRaw(trimmed)
    }
  }

  return (
    <div style={{
      margin: '0 16px 16px',
      padding: 14,
      background: hasValue ? `${task.color}12` : 'transparent',
      border: `1px solid ${hasValue ? `${task.color}80` : 'rgba(244,183,64,0.18)'}`,
      borderRadius: 16,
      boxShadow: hasValue ? `0 0 12px ${task.color}40` : 'none',
      display: 'flex', alignItems: 'center', gap: 8,
      transition: 'all 0.15s ease',
    }}>
      <span style={{
        color: hasValue ? task.color : 'var(--text-faint)',
        fontSize: 22, fontWeight: 600,
        transition: 'color 0.15s ease',
      }}>฿</span>
      <input
        ref={inputRef}
        type="text"
        inputMode="decimal"
        placeholder="0.00"
        value={raw}
        onChange={e => handleChange(e.target.value)}
        onBlur={handleBlur}
        style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          color: '#fff', fontSize: 26, fontWeight: 700,
          letterSpacing: -0.5, padding: 0,
        }}
      />
      <span style={{ color: 'var(--accent-dim)', fontSize: 10, fontWeight: 700, letterSpacing: 0.6, flexShrink: 0 }}>
        THB
      </span>
    </div>
  )
}

function fmt(v: number): string {
  return Number.isInteger(v) ? String(v) : String(v)
}
