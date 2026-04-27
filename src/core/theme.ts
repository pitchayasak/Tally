export const PALETTE = [
  '#F4B740',
  '#E8C96D',
  '#C4A7E7',
  '#6DD3A8',
  '#E57ABD',
  '#5EC7E8',
  '#F07A5A',
  '#8A8CD9',
]

export function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ]
}

export function cellColor(level: number, baseHex: string): string {
  if (level <= 0) return 'rgba(244,183,64,0.06)'
  const alphas = [0, 0.28, 0.52, 0.78, 1.0]
  const alpha = alphas[Math.min(level, 4)]
  const [r, g, b] = hexToRgb(baseHex)
  return `rgba(${r},${g},${b},${alpha})`
}
