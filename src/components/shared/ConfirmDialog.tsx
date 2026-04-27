interface Props {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
  danger?: boolean
}

export function ConfirmDialog({ title, message, confirmLabel = 'Confirm', onConfirm, onCancel, danger }: Props) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }} onClick={onCancel}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#111', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 16, padding: 24, maxWidth: 340, width: '100%',
        }}
      >
        <h3 style={{ margin: '0 0 8px', fontSize: 17 }}>{title}</h3>
        <p style={{ margin: '0 0 24px', color: 'var(--text-sub)', fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-line' }}>{message}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '12px', background: 'transparent',
            border: '1px solid rgba(255,255,255,0.15)', borderRadius: 10,
            color: 'var(--text-sub)', fontSize: 14, cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '12px',
            background: danger ? '#FF453A22' : 'var(--accent-faint)',
            border: `1px solid ${danger ? '#FF453A' : 'var(--accent)'}`,
            borderRadius: 10,
            color: danger ? '#FF453A' : 'var(--accent)',
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
