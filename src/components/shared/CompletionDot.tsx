import { cellColor } from '../../core/theme'

interface Props {
  level: number
  color: string
  size?: number
}

export function CompletionDot({ level, color, size = 10 }: Props) {
  const bg = level > 0 ? cellColor(level, color) : 'var(--accent-surf)'
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: bg,
    }}/>
  )
}
