export function DailyIcon({ active }: { active?: boolean }) {
  const color = active ? '#F4B740' : 'rgba(255,255,255,0.38)'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="17" rx="2" stroke={color} strokeWidth="1.5"/>
      <line x1="3" y1="9" x2="21" y2="9" stroke={color} strokeWidth="1.5"/>
      <line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="7" y="13" width="3" height="3" rx="0.5" fill={color}/>
    </svg>
  )
}

export function MonthlyIcon({ active }: { active?: boolean }) {
  const color = active ? '#F4B740' : 'rgba(255,255,255,0.38)'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="17" rx="2" stroke={color} strokeWidth="1.5"/>
      <line x1="3" y1="9" x2="21" y2="9" stroke={color} strokeWidth="1.5"/>
      <line x1="8" y1="2" x2="8" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="16" y1="2" x2="16" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="7" y1="13" x2="17" y2="13" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="7" y1="17" x2="14" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

export function HistoryIcon({ active }: { active?: boolean }) {
  const color = active ? '#F4B740' : 'rgba(255,255,255,0.38)'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="14" width="3" height="7" rx="1" fill={color}/>
      <rect x="7.5" y="10" width="3" height="11" rx="1" fill={color}/>
      <rect x="12" y="6" width="3" height="15" rx="1" fill={color}/>
      <rect x="16.5" y="3" width="3" height="18" rx="1" fill={color}/>
    </svg>
  )
}

export function TasksIcon({ active }: { active?: boolean }) {
  const color = active ? '#F4B740' : 'rgba(255,255,255,0.38)'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <line x1="9" y1="6" x2="20" y2="6" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="9" y1="12" x2="20" y2="12" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="9" y1="18" x2="20" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="5" cy="6" r="1.5" fill={color}/>
      <circle cx="5" cy="12" r="1.5" fill={color}/>
      <circle cx="5" cy="18" r="1.5" fill={color}/>
    </svg>
  )
}

export function SettingsIcon({ active }: { active?: boolean }) {
  const color = active ? '#F4B740' : 'rgba(255,255,255,0.38)'
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.5"/>
      <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
        stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}
