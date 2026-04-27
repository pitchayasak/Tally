import type { ExerciseIcon as EIcon } from '../../core/models'

export function ExerciseIcon({ icon, color, size = 20 }: { icon?: EIcon; color: string; size?: number }) {
  const c = color
  if (icon === 'bicycle') return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="5" cy="13" r="3" stroke={c} strokeWidth="1.5"/>
      <circle cx="15" cy="13" r="3" stroke={c} strokeWidth="1.5"/>
      <path d="M5 13L10 7L15 13" stroke={c} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M10 7V5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
  if (icon === 'play') return (
    // Yoga / stretching pose — person sitting cross-legged with arms raised
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="3.5" r="1.5" fill={c}/>
      {/* torso */}
      <path d="M10 5.5V10" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
      {/* arms raised wide */}
      <path d="M10 7L6.5 5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M10 7L13.5 5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
      {/* crossed legs sitting */}
      <path d="M10 10L7 13.5L10 12L13 13.5L10 10" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
  if (icon === 'drive') return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <path d="M3 12L5 7h10l2 5v3H3v-3z" stroke={c} strokeWidth="1.5" strokeLinejoin="round" fill={c} fillOpacity="0.1"/>
      <circle cx="6.5" cy="14.5" r="1.5" fill={c}/>
      <circle cx="13.5" cy="14.5" r="1.5" fill={c}/>
    </svg>
  )
  // default: run
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle cx="13" cy="4" r="1.5" fill={c}/>
      <path d="M11 6.5l-3 4 3 3-2 4" stroke={c} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M8 10.5l-3 2" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M11 6.5l4 1.5" stroke={c} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
