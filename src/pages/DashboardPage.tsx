import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface AuthUser {
  name: string
  email: string
  token: string
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('lh_auth')
      if (!raw) { navigate('/login'); return }
      setUser(JSON.parse(raw))
    } catch {
      navigate('/login')
    }
  }, [navigate])

  function logout() {
    localStorage.removeItem('lh_auth')
    navigate('/login')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-[var(--color-paper)] flex flex-col items-center justify-center gap-4 font-[family-name:var(--font-sans)]">
      <div className="bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[22px] p-10 text-center max-w-sm w-full"
        style={{ boxShadow: '0 6px 24px -6px rgba(18,24,38,.18)' }}>
        <div className="w-14 h-14 rounded-full bg-[var(--color-good-bg)] text-[var(--color-good)] grid place-items-center mx-auto mb-4">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 13l6 6 12-12"/>
          </svg>
        </div>
        <h2 className="font-[family-name:var(--font-serif)] font-bold text-xl text-[var(--color-ink)] tracking-tight mb-1">
          Welcome back, {user.name}!
        </h2>
        <p className="text-[13px] text-[var(--color-ink-3)] mb-6">{user.email}</p>
        <button
          onClick={logout}
          className="w-full h-10 rounded-lg bg-[var(--color-paper-2)] border border-[var(--color-line-2)] text-[13.5px] font-medium text-[var(--color-ink-2)] cursor-pointer transition-all hover:bg-[var(--color-paper-3)]"
        >
          Sign out
        </button>
      </div>
    </div>
  )
}
