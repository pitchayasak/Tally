import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../context/AuthContext'
import { signOut } from '../firebase/auth'
import { ConfirmDialog } from '../components/shared/ConfirmDialog'
import { SEED_DESCRIPTION } from '../core/seedData'

export function SettingsPage() {
  const { showProgressBar, toggleProgressBar, clearStore, resetStore } = useApp()
  const { user } = useAuth()
  const [dialog, setDialog] = useState<'wipe' | 'seed' | null>(null)
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ text: string; error?: boolean } | null>(null)

  async function handleWipe() {
    setBusy(true)
    setDialog(null)
    try {
      await clearStore()
      setMsg({ text: 'All data wiped.' })
    } catch (e) {
      setMsg({ text: `Error: ${(e as Error).message}`, error: true })
    } finally {
      setBusy(false)
    }
  }

  async function handleSeed() {
    setBusy(true)
    setDialog(null)
    try {
      await resetStore()
      setMsg({ text: 'Sample data loaded.' })
    } catch (e) {
      setMsg({ text: `Error: ${(e as Error).message}`, error: true })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ padding: '16px 0 40px' }}>
      <div style={{ padding: '8px 16px 16px' }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>Settings</h2>
      </div>

      {/* Account */}
      <Section title="Account">
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          {user?.photoURL && (
            <img src={user.photoURL} alt="" referrerPolicy="no-referrer" style={{ width: 36, height: 36, borderRadius: '50%' }} />
          )}
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600 }}>{user?.displayName ?? 'User'}</div>
            <div style={{ fontSize: 12, color: 'var(--text-sub)' }}>{user?.email}</div>
          </div>
        </div>
        <SettingRow label="Sign out" onClick={signOut} color="var(--text-sub)" />
      </Section>

      {/* Display */}
      <Section title="Display">
        <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 500, fontSize: 15 }}>Progress bar & count</div>
            <div style={{ fontSize: 12, color: 'var(--text-sub)', marginTop: 2 }}>Show on Daily and Monthly tabs</div>
          </div>
          <Toggle active={showProgressBar} onToggle={toggleProgressBar} />
        </div>
      </Section>

      {/* Data */}
      <Section title="Data">
        <div style={{ padding: '10px 16px', fontSize: 12, color: 'var(--text-sub)', lineHeight: 1.6 }}>
          Your data is stored securely in the cloud and synced across devices via your Google account.
        </div>
        <div style={{ padding: '8px 16px 4px', fontSize: 12, color: 'var(--text-faint)', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {SEED_DESCRIPTION}
        </div>
        <SettingRow label="Generate sample data" onClick={() => setDialog('seed')} color="var(--accent)" />
      </Section>

      {/* Danger zone */}
      <Section title="Danger Zone">
        <SettingRow label="Wipe all data" onClick={() => setDialog('wipe')} color="#FF453A" />
      </Section>

      {msg && (
        <div style={{
          margin: '16px', padding: '12px', borderRadius: 8, fontSize: 13,
          background: msg.error ? 'rgba(255,69,58,0.1)' : 'var(--accent-faint)',
          color: msg.error ? '#FF453A' : 'var(--accent)',
          border: `1px solid ${msg.error ? 'rgba(255,69,58,0.3)' : 'var(--accent-dim)'}`,
        }}>
          {msg.text}
        </div>
      )}

      {busy && (
        <div style={{ textAlign: 'center', padding: 16, color: 'var(--text-sub)', fontSize: 13 }}>
          Working…
        </div>
      )}

      {dialog === 'wipe' && (
        <ConfirmDialog
          title="Wipe all data?"
          message="This will permanently delete all your tasks and history. This cannot be undone."
          confirmLabel="Wipe everything"
          onConfirm={handleWipe}
          onCancel={() => setDialog(null)}
          danger
        />
      )}

      {dialog === 'seed' && (
        <ConfirmDialog
          title="Generate sample data?"
          message={`This will wipe your existing data and load sample tasks with today's entries.\n\n${SEED_DESCRIPTION}`}
          confirmLabel="Load sample data"
          onConfirm={handleSeed}
          onCancel={() => setDialog(null)}
        />
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ padding: '6px 16px', fontSize: 11, color: 'var(--text-faint)', letterSpacing: 1, fontWeight: 600 }}>
        {title.toUpperCase()}
      </div>
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'var(--card)' }}>
        {children}
      </div>
    </div>
  )
}

function SettingRow({ label, onClick, color }: { label: string; onClick: () => void; color?: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: '100%', padding: '14px 16px',
        background: 'transparent', border: 'none',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        color: color ?? '#fff', fontSize: 15, textAlign: 'left',
        cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}
    >
      {label}
      <span style={{ color: 'var(--text-faint)', fontSize: 18 }}>›</span>
    </button>
  )
}

function Toggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: 44, height: 26, borderRadius: 13,
        background: active ? 'var(--accent)' : 'rgba(255,255,255,0.15)',
        border: 'none', position: 'relative', cursor: 'pointer',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: active ? 21 : 3,
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s',
      }} />
    </button>
  )
}
