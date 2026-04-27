interface Props {
  label: string
  active: boolean
  color: string
  onClick: () => void
}

export function ChoiceChip({ label, active, color, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '6px 14px',
        background: active ? `${color}22` : 'transparent',
        border: `1.5px solid ${active ? color : 'rgba(255,255,255,0.15)'}`,
        borderRadius: 20,
        color: active ? color : 'var(--text-sub)',
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'all 0.15s ease',
        boxShadow: active ? `0 0 6px ${color}44` : 'none',
      }}
    >
      {label}
    </button>
  )
}
