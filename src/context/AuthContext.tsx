import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { onAuthStateChanged, getRedirectResult, type User } from 'firebase/auth'
import { auth } from '../firebase/config'

interface AuthCtx {
  user: User | null
  loading: boolean
}

const Ctx = createContext<AuthCtx>({ user: null, loading: true })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Handle redirect result from mobile sign-in
    getRedirectResult(auth).catch(() => {})

    const unsub = onAuthStateChanged(auth, u => {
      setUser(u)
      setLoading(false)
    })
    return unsub
  }, [])

  return <Ctx.Provider value={{ user, loading }}>{children}</Ctx.Provider>
}

export function useAuth() {
  return useContext(Ctx)
}
