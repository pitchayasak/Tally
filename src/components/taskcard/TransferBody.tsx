import { useState } from 'react'
import type { Task, TransferEntry } from '../../core/models'

const PRESETS = [7500, 20000]

interface Props {
  task: Task
  entry: TransferEntry | null | undefined
  onChange: (e: TransferEntry | null) => void
}

export function TransferBody({ task, entry, onChange }: Props) {
  const current = entry?.amount ?? null
  const [showCustom, setShowCustom] = useState(
    current != null && !PRESETS.includes(current)
  )
  const [customRaw, setCustomRaw] = useState(() => {
    if (current != null && !PRESETS.includes(current)) return formatAmt(current)
    return ''
  })

  function handlePreset(opt: number) {
    setShowCustom(false)
    const active = !showCustom && current === opt
    onChange(active ? null : { amount: opt })
  }

  function handleCustomToggle() {
    const next = !showCustom
    setShowCustom(next)
    if (!next) { setCustomRaw(''); onChange(null) }
  }

  function handleCustomChange(v: string) {
    const cleaned = v.replace(/[^0-9.]/g, '')
    setCustomRaw(cleaned)
    const parsed = parseFloat(cleaned)
    if (cleaned && !isNaN(parsed) && parsed > 0) onChange({ amount: parsed })
    else onChange(null)
  }

  return (
    <div style={{ padding: '0 16px 16px' }}>
      {/* Preset + Custom buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        {PRESETS.map(opt => {
          const active = !showCustom && current === opt
          return (
            <PresetCard
              key={opt}
              label={opt === 7500 ? '฿ 7,500' : '฿ 20,000'}
              active={active}
              color={task.color}
              onClick={() => handlePreset(opt)}
            />
          )
        })}
        <PresetCard
          label="Custom"
          sublabel="฿"
          active={showCustom}
          color={task.color}
          onClick={handleCustomToggle}
        />
      </div>

      {/* Custom input */}
      {showCustom && (
        <div style={{
          marginTop: 10,
          display: 'flex', alignItems: 'center',
          background: 'var(--accent-surf)',
          border: `1px solid ${task.color}66`,
          borderRadius: 14,
          padding: '0 14px',
        }}>
          <span style={{ color: task.color, fontSize: 20, fontWeight: 700, marginRight: 8 }}>฿</span>
          <input
            type="text"
            inputMode="decimal"
            autoFocus
            placeholder="0"
            value={customRaw}
            onChange={e => handleCustomChange(e.target.value)}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: '#fff', fontSize: 20, fontWeight: 700, padding: '14px 0',
              letterSpacing: -0.3,
            }}
          />
          <span style={{ color: 'var(--accent-dim)', fontSize: 11, fontWeight: 700, letterSpacing: 0.6 }}>THB</span>
        </div>
      )}
    </div>
  )
}

function PresetCard({ label, sublabel, active, color, onClick }: {
  label: string; sublabel?: string; active: boolean; color: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, height: 62, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 2,
        background: active ? `${color}1A` : 'transparent',
        border: `1px solid ${active ? `${color}AA` : 'rgba(244,183,64,0.18)'}`,
        borderRadius: 16,
        boxShadow: active ? `0 0 14px ${color}66` : 'none',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      <span style={{
        color: active ? '#fff' : 'var(--text-sub)',
        fontSize: label.startsWith('฿') ? 18 : 14,
        fontWeight: 700, letterSpacing: -0.3,
      }}>{label}</span>
      {sublabel && (
        <span style={{
          color: active ? 'var(--accent-dim)' : 'var(--text-faint)',
          fontSize: 12, fontWeight: 700,
        }}>{sublabel}</span>
      )}
      {!sublabel && (
        <span style={{
          color: active ? 'var(--accent-dim)' : 'var(--text-faint)',
          fontSize: 10, fontWeight: 700, letterSpacing: 0.6,
        }}>THB</span>
      )}
    </button>
  )
}

function formatAmt(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(2)
}
