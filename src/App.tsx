import { useAuth } from './context/AuthContext'
import { AppProvider } from './context/AppContext'
import { AppShell } from './components/shell/AppShell'
import { LoginPage } from './pages/LoginPage'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100dvh', color: 'var(--text-sub)',
      }}>
        <div style={{ fontSize: 32 }}>✦</div>
      </div>
    )
  }

  if (!user) return <LoginPage />

  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
