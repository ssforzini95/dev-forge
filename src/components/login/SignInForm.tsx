import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import InputField from './InputField'
import { signIn } from '../../api/auth'

const EmailIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1.5" y="3.5" width="13" height="9" rx="1.5"/><path d="M1.5 5.5l6.5 4 6.5-4"/>
  </svg>
)

const LockIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="10" height="7" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/>
    <circle cx="8" cy="10.5" r="1" fill="currentColor" stroke="none"/>
  </svg>
)

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 8h10M10 5l3 3-3 3"/>
  </svg>
)

export default function SignInForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: typeof errors = {}

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = 'Enter a valid email address.'
    if (password.length < 4)
      errs.password = 'Password must be at least 4 characters.'

    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setErrors({})

    try {
      const { data } = await signIn({ email, password })
      localStorage.setItem('lh_auth', JSON.stringify({ ...data.user, token: data.token, ts: Date.now() }))
      navigate('/dashboard')
    } catch (err: unknown) {
      const status = (err as { response?: { status: number } })?.response?.status
      if (status === 401) {
        setErrors({ general: 'Incorrect email or password.' })
      } else {
        setErrors({ general: 'Something went wrong. Please try again.' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[14px]">
      <InputField
        label="Email address"
        id="si-email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        value={email}
        onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined, general: undefined })) }}
        icon={<EmailIcon />}
        error={errors.email}
      />

      <InputField
        label="Password"
        id="si-pw"
        isPassword
        placeholder="Your password"
        autoComplete="current-password"
        value={password}
        onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined, general: undefined })) }}
        icon={<LockIcon />}
        error={errors.password}
        rightSlot={
          <a href="#" className="text-[12px] font-medium text-[var(--color-brand)] no-underline hover:text-[var(--color-brand-2)]">
            Forgot password?
          </a>
        }
      />

      {errors.general && (
        <p className="flex items-center gap-[5px] text-[11.5px] text-[var(--color-err)] -mt-[2px]">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
            <circle cx="8" cy="8" r="6"/><path d="M8 5v3.5M8 11v.5"/>
          </svg>
          {errors.general}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-[42px] mt-1 border-none rounded-lg bg-[var(--color-brand)] text-white text-[14px] font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all hover:bg-[var(--color-brand-2)] active:translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
        style={{ boxShadow: '0 2px 8px -2px oklch(0.50 0.18 260 / .40)' }}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Please wait…
          </>
        ) : (
          <>
            <span>Sign in</span>
            <ArrowIcon />
          </>
        )}
      </button>

      <div className="flex gap-[10px] items-start bg-[var(--color-paper-2)] border border-[var(--color-line)] rounded-lg p-[11px_13px] text-[11.5px] text-[var(--color-ink-3)] leading-[1.55] mt-1">
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="var(--color-ink-4)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="flex-none mt-[1px]">
          <circle cx="8" cy="8" r="6"/><path d="M8 7v4M8 5v.5"/>
        </svg>
        <div>
          <strong className="text-[var(--color-ink-2)]">Demo</strong>
          {' — '}
          <kbd className="font-[family-name:var(--font-mono)] text-[10px] bg-[var(--color-surface)] border border-[var(--color-line-2)] rounded px-[5px] py-[1px] text-[var(--color-ink-2)]">demo@devforge.io</kbd>
          {' / '}
          <kbd className="font-[family-name:var(--font-mono)] text-[10px] bg-[var(--color-surface)] border border-[var(--color-line-2)] rounded px-[5px] py-[1px] text-[var(--color-ink-2)]">demo1234</kbd>
        </div>
      </div>
    </form>
  )
}
