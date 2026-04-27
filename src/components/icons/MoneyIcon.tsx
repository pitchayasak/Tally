import type { TaskType } from '../../core/models'

export function MoneyIcon({ type, color, size = 20 }: { type: TaskType; color: string; size?: number }) {
  if (type === 'transfer') return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.08"/>
      <path d="M7 10h6M10 7l3 3-3 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke={color} strokeWidth="1.5" fill={color} fillOpacity="0.08"/>
      <text x="10" y="14" textAnchor="middle" fontSize="9" fill={color} fontWeight="600">฿</text>
    </svg>
  )
}
