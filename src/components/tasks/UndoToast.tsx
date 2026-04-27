import { useEffect, useState } from 'react'

interface Props {
  message: string
  onUndo: () => void
  duration?: number
}

export function UndoToast({ message, onUndo, duration = 4000 }: Props) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      setProgress(Math.max(0, 100 - (elapsed / duration) * 100))
    }, 50)
    return () => clearInterval(interval)
  }, [duration])

  return (
    <div style={{
      position: 'fixed', bottom: 80, left: '50%', transform: 'translateX(-50%)',
      background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.15)',
      borderRadius: 12, padding: '12px 16px',
      display: 'flex', alignItems: 'center', gap: 16,
      zIndex: 100, width: 'calc(100% - 32px)', maxWidth: 400,
      boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
    }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, marginBottom: 6 }}>{message}</div>
        <div style={{ height: 2, background: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: 'var(--accent)', borderRadius: 1,
            transition: 'width 0.05s linear',
          }} />
        </div>
      </div>
      <button
        onClick={onUndo}
        style={{
          background: 'var(--accent-faint)', border: '1px solid var(--accent-dim)',
          borderRadius: 8, padding: '8px 14px',
          color: 'var(--accent)', fontSize: 13, fontWeight: 700, cursor: 'pointer',
        }}
      >Undo</button>
    </div>
  )
}
