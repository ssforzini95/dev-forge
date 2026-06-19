import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import InputField from './InputField'
import PasswordStrength from './PasswordStrength'
import { register } from '../../api/auth'
import * as React from "react";

const UserIcon = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="5.5" r="2.5"/><path d="M2.5 13.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5"/>
  </svg>
)

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

export default function RegisterForm() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; confirm?: string; general?: string }>({})
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs: typeof errors = {}

    if (!name) errs.name = 'Please enter your name.'
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email address.'
    if (password.length < 8) errs.password = 'Password must be at least 8 characters.'
    if (password !== confirm) errs.confirm = "Passwords don't match."

    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setErrors({})

    try {
      const { data } = await register({ name, email, password })
      localStorage.setItem('lh_auth', JSON.stringify({ ...data.user, token: data.token, ts: Date.now() }))
      navigate('/dashboard')
    } catch (err: unknown) {
      const status = (err as { response?: { status: number } })?.response?.status
      if (status === 409) {
        setErrors({ email: 'An account with this email already exists.' })
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
        label="Full name"
        id="reg-name"
        type="text"
        placeholder="Your full name"
        autoComplete="name"
        value={name}
        onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: undefined })) }}
        icon={<UserIcon />}
        error={errors.name}
      />

      <InputField
        label="Email address"
        id="reg-email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        value={email}
        onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })) }}
        icon={<EmailIcon />}
        error={errors.email}
      />

      <div className="flex flex-col gap-[5px]">
        <InputField
          label="Password"
          id="reg-pw"
          isPassword
          placeholder="Create a password"
          autoComplete="new-password"
          value={password}
          onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })) }}
          icon={<LockIcon />}
          error={errors.password}
        />
        <PasswordStrength password={password} />
      </div>

      <InputField
        label="Confirm password"
        id="reg-pw2"
        isPassword
        placeholder="Repeat password"
        autoComplete="new-password"
        value={confirm}
        onChange={e => { setConfirm(e.target.value); setErrors(p => ({ ...p, confirm: undefined })) }}
        icon={<LockIcon />}
        error={errors.confirm}
      />

      {errors.general && (
        <p className="flex items-center gap-[5px] text-[11.5px] text-[var(--color-err)]">
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
            <span>Create account</span>
            <ArrowIcon />
          </>
        )}
      </button>

      <p className="text-[11.5px] text-[var(--color-ink-4)] text-center mt-[6px]">
        By creating an account you agree to our{' '}
        <a href="#" className="text-[var(--color-ink-3)] underline underline-offset-2">Terms of Service</a>
        {' '}and{' '}
        <a href="#" className="text-[var(--color-ink-3)] underline underline-offset-2">Privacy Policy</a>.
      </p>
    </form>
  )
}
