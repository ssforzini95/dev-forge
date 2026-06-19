import { useState } from 'react'
import BrandMark from '../components/login/BrandMark'
import SocialButtons from '../components/login/SocialButtons'
import SignInForm from '../components/login/SignInForm'
import RegisterForm from '../components/login/RegisterForm'

type Tab = 'signin' | 'register'

export default function LoginPage() {
  const [tab, setTab] = useState<Tab>('signin')

  function handleSocial(provider: string) {
    alert(`OAuth with ${provider} — wire up a real OAuth provider here.`)
  }

  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

      <div className="min-h-screen bg-paper flex flex-col font-sans text-ink antialiased relative">

        {/* Background grid */}
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-55"
          style={{
            backgroundImage: 'linear-gradient(var(--color-paper-2) 1px, transparent 1px), linear-gradient(90deg, var(--color-paper-2) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Background glow */}
        <div
          className="fixed pointer-events-none z-0"
          style={{
            top: '-20%', left: '50%', transform: 'translateX(-50%)',
            width: 900, height: 600,
            background: 'radial-gradient(ellipse at 50% 0%, oklch(0.55 0.22 257 / .30) 0%, oklch(0.45 0.15 280 / .12) 45%, transparent 70%)',
          }}
        />

        {/* Stage */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-5 py-12 gap-7">

          <BrandMark />

          {/* Card */}
          <div
            className="w-full max-w-[436px] bg-[var(--color-surface)] border border-[var(--color-line)] rounded-[22px] overflow-hidden"
            style={{ boxShadow: '0 6px 24px -6px rgba(18,24,38,.18), 0 2px 8px -2px rgba(18,24,38,.10)' }}
          >
            {/* Tabs */}
            <div className="grid grid-cols-2 border-b border-[var(--color-line)]">
              {(['signin', 'register'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={[
                    'py-4 text-[13.5px] font-semibold bg-transparent border-none cursor-pointer relative transition-colors',
                    tab === t
                      ? 'text-[var(--color-ink)]'
                      : 'text-[var(--color-ink-3)] hover:text-[var(--color-ink-2)] hover:bg-[var(--color-surface-2)]',
                  ].join(' ')}
                >
                  {t === 'signin' ? 'Sign in' : 'Create account'}
                  {tab === t && (
                    <span className="absolute left-[20%] right-[20%] -bottom-px h-[2px] rounded-full bg-[var(--color-brand)]" />
                  )}
                </button>
              ))}
            </div>

            {/* Card body */}
            <div className="p-7 pb-8 max-[480px]:p-5 max-[480px]:pb-6">
              <p className="text-[13px] text-[var(--color-ink-3)] mb-[22px]">
                {tab === 'signin'
                  ? 'Welcome back — continue your learning journey.'
                  : 'Join DevForge and start building your skills today.'}
              </p>

              <SocialButtons mode={tab} onSocial={handleSocial} />

              <div className="flex items-center gap-3 text-[var(--color-ink-4)] text-[11.5px] font-medium my-5 before:flex-1 before:h-px before:bg-[var(--color-line)] after:flex-1 after:h-px after:bg-[var(--color-line)]">
                {tab === 'signin' ? 'or continue with email' : 'or register with email'}
              </div>

              {tab === 'signin' ? <SignInForm /> : <RegisterForm />}
            </div>
          </div>

          {/* Footer note */}
          <p className="text-[12px] text-[var(--color-ink-4)] text-center">
            {tab === 'signin' ? (
              <>Don't have an account?{' '}
                <button onClick={() => setTab('register')} className="text-[var(--color-ink-3)] underline underline-offset-[3px] bg-transparent border-none cursor-pointer p-0 text-[12px]">
                  Create one free
                </button>
              </>
            ) : (
              <>Already have an account?{' '}
                <button onClick={() => setTab('signin')} className="text-[var(--color-ink-3)] underline underline-offset-[3px] bg-transparent border-none cursor-pointer p-0 text-[12px]">
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </>
  )
}
