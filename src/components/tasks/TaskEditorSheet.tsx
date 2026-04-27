import { useState } from 'react'
import type { Task, TaskType, TaskFrequency, ExerciseMode, ExerciseIcon } from '../../core/models'
import { PALETTE } from '../../core/theme'
import { ColorPicker } from '../shared/ColorPicker'
import { ExerciseIcon as ExerciseIconSvg } from '../icons/ExerciseIcon'

interface Props {
  task: Task | null // null = creating new
  uid: string
  onSave: (task: Task, isNew: boolean) => void
  onDelete?: (taskId: string) => void
  onClose: () => void
}

const TYPES: { value: TaskType; label: string }[] = [
  { value: 'pill', label: 'Pill' },
  { value: 'exercise', label: 'Exercise' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'spend', label: 'Spend' },
]

const ICONS: { value: ExerciseIcon; label: string }[] = [
  { value: 'run',     label: 'Run' },
  { value: 'bicycle', label: 'Bike' },
  { value: 'play',    label: 'Yoga' },
  { value: 'drive',   label: 'Drive' },
]

export function TaskEditorSheet({ task, uid, onSave, onDelete, onClose }: Props) {
  const isNew = !task
  const [type, setType] = useState<TaskType>(task?.type ?? 'pill')
  const [name, setName] = useState(task?.name ?? '')
  const [freq, setFreq] = useState<TaskFrequency>(task?.frequency ?? 'daily')
  const [mode, setMode] = useState<ExerciseMode>(task?.mode ?? 'duration')
  const [icon, setIcon] = useState<ExerciseIcon>(task?.icon ?? 'run')
  const [color, setColor] = useState(task?.color ?? PALETTE[0])
  const [error, setError] = useState<string | null>(null)

  function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) { setError('Task name is required.'); return }
    if (trimmed.length > 50) { setError('Name must be 50 characters or less.'); return }
    const saved: Task = {
      id: task?.id ?? `${uid}_${Date.now()}`,
      uid,
      type,
      name: trimmed,
      color,
      created: task?.created ?? Date.now(),
      frequency: freq,
      mode: type === 'exercise' ? mode : undefined,
      icon: type === 'exercise' ? icon : undefined,
      order: task?.order ?? Date.now(),
    }
    onSave(saved, isNew)
    onClose()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)' }} onClick={onClose}>
      <div
        style={{
          position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
          width: '100%', maxWidth: 430, background: '#0d0d0d',
          borderRadius: '16px 16px 0 0', overflow: 'hidden',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          maxHeight: '90dvh', overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '16px 16px 24px' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ flex: 1, margin: 0, fontSize: 17 }}>{isNew ? 'New Task' : 'Edit Task'}</h3>
            <button onClick={onClose} style={closeBtnStyle}>✕</button>
          </div>

          {/* Type picker */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Type</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {TYPES.map(t => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  style={{
                    flex: 1, padding: '8px 4px', fontSize: 12, fontWeight: 600,
                    background: type === t.value ? 'var(--accent-faint)' : 'transparent',
                    border: `1.5px solid ${type === t.value ? 'var(--accent)' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: 8, color: type === t.value ? 'var(--accent)' : 'var(--text-sub)',
                    cursor: 'pointer',
                  }}
                >{t.label}</button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Name</label>
            <input
              type="text"
              maxLength={50}
              placeholder="Task name"
              value={name}
              onChange={e => { setName(e.target.value); setError(null) }}
              style={{
                width: '100%', padding: '12px', borderRadius: 8,
                background: 'rgba(255,255,255,0.05)',
                border: '1.5px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: 15, outline: 'none', boxSizing: 'border-box',
              }}
            />
            <div style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'right', marginTop: 4 }}>
              {name.length}/50
            </div>
          </div>

          {/* Frequency */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Frequency</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {(['daily', 'monthly'] as TaskFrequency[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFreq(f)}
                  style={{
                    flex: 1, padding: '10px', fontSize: 13, fontWeight: 600,
                    background: freq === f ? 'var(--accent-faint)' : 'transparent',
                    border: `1.5px solid ${freq === f ? 'var(--accent)' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: 8, color: freq === f ? 'var(--accent)' : 'var(--text-sub)',
                    cursor: 'pointer', textTransform: 'capitalize',
                  }}
                >{f}</button>
              ))}
            </div>
          </div>

          {/* Exercise-specific options */}
          {type === 'exercise' && (
            <>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Tracking</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {(['duration', 'distance'] as ExerciseMode[]).map(m => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      style={{
                        flex: 1, padding: '10px', fontSize: 13, fontWeight: 600,
                        background: mode === m ? 'var(--accent-faint)' : 'transparent',
                        border: `1.5px solid ${mode === m ? 'var(--accent)' : 'rgba(255,255,255,0.12)'}`,
                        borderRadius: 8, color: mode === m ? 'var(--accent)' : 'var(--text-sub)',
                        cursor: 'pointer', textTransform: 'capitalize',
                      }}
                    >{m}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>Icon</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {ICONS.map(ic => {
                    const active = icon === ic.value
                    const iconColor = active ? color : 'rgba(255,255,255,0.38)'
                    return (
                      <button
                        key={ic.value}
                        onClick={() => setIcon(ic.value)}
                        style={{
                          flex: 1, padding: '10px 8px',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                          background: active ? `${color}1A` : 'transparent',
                          border: `1.5px solid ${active ? `${color}AA` : 'rgba(255,255,255,0.12)'}`,
                          borderRadius: 10,
                          cursor: 'pointer',
                          boxShadow: active ? `0 0 10px ${color}44` : 'none',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <ExerciseIconSvg icon={ic.value} color={iconColor} size={22} />
                        <span style={{
                          fontSize: 10, fontWeight: 600, letterSpacing: 0.3,
                          color: active ? color : 'var(--text-faint)',
                        }}>{ic.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </>
          )}

          {/* Color */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Color</label>
            <ColorPicker value={color} onChange={setColor} />
          </div>

          {error && <p style={{ color: '#FF453A', fontSize: 13, marginBottom: 12 }}>{error}</p>}

          {/* Save */}
          <button
            onClick={handleSave}
            style={{
              width: '100%', padding: '14px',
              background: 'var(--accent)', border: 'none', borderRadius: 12,
              color: '#000', fontSize: 15, fontWeight: 700, cursor: 'pointer',
              marginBottom: 10,
            }}
          >Save</button>

          {/* Delete */}
          {!isNew && onDelete && (
            <button
              onClick={() => { onDelete(task!.id); onClose() }}
              style={{
                width: '100%', padding: '14px',
                background: 'rgba(255,69,58,0.1)', border: '1px solid #FF453A',
                borderRadius: 12, color: '#FF453A', fontSize: 14,
                fontWeight: 600, cursor: 'pointer',
              }}
            >Delete task</button>
          )}
        </div>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, color: 'var(--text-sub)',
  letterSpacing: 1, marginBottom: 8, fontWeight: 600,
}

const closeBtnStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.08)', border: 'none',
  borderRadius: '50%', width: 28, height: 28,
  color: 'var(--text-sub)', cursor: 'pointer', fontSize: 12,
}
