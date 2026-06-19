interface Props {
  password: string
}

function getScore(val: string): 0 | 1 | 2 | 3 {
  if (!val) return 0
  let score = 0
  if (val.length >= 8) score++
  if (/[A-Z]/.test(val) || /\d/.test(val)) score++
  if (/[^a-zA-Z0-9]/.test(val) || val.length >= 14) score++
  return score as 0 | 1 | 2 | 3
}

const barColor: Record<number, string> = {
  1: 'bg-[oklch(0.60_0.18_25)]',
  2: 'bg-[oklch(0.70_0.16_55)]',
  3: 'bg-[var(--color-good)]',
}

export default function PasswordStrength({ password }: Props) {
  const score = getScore(password)

  if (!password) return null

  return (
    <div className="flex gap-1 mt-[2px]">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={[
            'flex-1 h-[3px] rounded-full transition-all duration-300',
            i <= score ? barColor[score] : 'bg-[var(--color-line)]',
          ].join(' ')}
        />
      ))}
    </div>
  )
}
