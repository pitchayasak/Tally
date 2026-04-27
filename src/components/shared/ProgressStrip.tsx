interface Props {
  done: number
  total: number
}

export function ProgressStrip({ done, total }: Props) {
  const pct = total > 0 ? (done / total) * 100 : 0
  return (
    <div style={{ padding: '8px 16px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: 'var(--text-sub)', letterSpacing: 1 }}>PROGRESS</span>
        <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 600 }}>{done}/{total}</span>
      </div>
      <div style={{ height: 3, background: 'var(--accent-surf)', borderRadius: 2 }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: 'var(--accent)',
          borderRadius: 2,
          transition: 'width 0.3s ease',
        }}/>
      </div>
    </div>
  )
}
