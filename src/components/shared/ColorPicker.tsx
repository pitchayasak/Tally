import { PALETTE } from '../../core/theme'

interface Props {
  value: string
  onChange: (color: string) => void
}

export function ColorPicker({ value, onChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {PALETTE.map(c => (
        <button
          key={c}
          onClick={() => onChange(c)}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: c,
            border: value === c ? '3px solid #fff' : '3px solid transparent',
            cursor: 'pointer',
            boxShadow: value === c ? `0 0 8px ${c}` : 'none',
            padding: 0,
            transition: 'all 0.15s ease',
          }}
        />
      ))}
    </div>
  )
}
