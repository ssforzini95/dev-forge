import { useState, type InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  id: string
  icon: React.ReactNode
  error?: string
  isPassword?: boolean
  rightSlot?: React.ReactNode
}

export default function InputField({ label, id, icon, error, isPassword, rightSlot, ...rest }: Props) {
  const [showPw, setShowPw] = useState(false)

  const inputType = isPassword ? (showPw ? 'text' : 'password') : rest.type

  return (
    <div className="flex flex-col gap-[5px]">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-[12.5px] font-semibold text-[var(--color-ink-2)] tracking-[0.01em]">
          {label}
        </label>
        {rightSlot}
      </div>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-[var(--color-ink-4)] pointer-events-none">
          {icon}
        </span>

        <input
          {...rest}
          id={id}
          type={inputType}
          className={[
            'w-full h-[42px] pl-[38px] pr-3 font-[family-name:var(--font-sans)] text-[13.5px]',
            'text-[var(--color-ink)] bg-[var(--color-surface-2)]',
            'border rounded-lg outline-none',
            'transition-all placeholder:text-[var(--color-ink-4)]',
            error
              ? 'border-[var(--color-err)] shadow-[0_0_0_3px_var(--color-err-bg)]'
              : 'border-[var(--color-line-2)] focus:border-[var(--color-brand)] focus:bg-[var(--color-surface)] focus:shadow-[0_0_0_3px_var(--color-brand-bg)]',
            isPassword ? 'pr-10' : '',
          ].join(' ')}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw(v => !v)}
            className="absolute right-[10px] top-1/2 -translate-y-1/2 w-7 h-7 rounded-[6px] border-none bg-transparent text-[var(--color-ink-4)] cursor-pointer grid place-items-center transition-all hover:bg-[var(--color-paper-2)] hover:text-[var(--color-ink-2)]"
          >
            {showPw ? (
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"/><circle cx="8" cy="8" r="2"/>
                <line x1="2" y1="2" x2="14" y2="14"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z"/><circle cx="8" cy="8" r="2"/>
              </svg>
            )}
          </button>
        )}
      </div>

      {error && (
        <p className="flex items-center gap-[5px] text-[11.5px] text-[var(--color-err)]">
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-none">
            <circle cx="8" cy="8" r="6"/><path d="M8 5v3.5M8 11v.5"/>
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
