import { useState, useEffect } from 'react'

export function useIsWide(): boolean {
  const [isWide, setIsWide] = useState(() => window.innerWidth >= 768)

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    setIsWide(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsWide(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isWide
}
