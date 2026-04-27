export function PillIcon({ color, size = 20 }: { color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <rect x="2" y="8" width="16" height="4" rx="2" fill={color} opacity="0.15"/>
      <path d="M10 8V12M2 10h16" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="2" y="8" width="16" height="4" rx="2" stroke={color} strokeWidth="1.5"/>
    </svg>
  )
}
