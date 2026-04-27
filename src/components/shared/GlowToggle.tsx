interface Props {
  label: string
  active: boolean
  color: string
  onClick: () => void
}

export function GlowToggle({ label, active, color, onClick }: Props) {
  const bg = active
    ? `${color}22`
    : 'transparent'
  const border = active ? color : 'rgba(255,255,255,0.15)'
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '10px 8px',
        background: bg,
        border: `1.5px solid ${border}`,
        borderRadius: 8,
        color: active ? color : 'var(--text-sub)',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        boxShadow: active ? `0 0 8px ${color}44` : 'none',
      }}
    >
      {label}
    </button>
  )
}
