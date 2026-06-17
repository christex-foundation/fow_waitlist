type LogoProps = {
  /** 'dark' = ink mark on light bg (header). 'light' = canvas mark on ink bg (footer). */
  tone?: 'dark' | 'light'
  showSub?: boolean
}

/** "F" monogram + Future of Work wordmark. */
export default function Logo({ tone = 'dark', showSub = true }: LogoProps) {
  const isDark = tone === 'dark'
  const mark = isDark ? 'bg-ink text-canvas' : 'bg-canvas text-ink'
  const word = isDark ? 'text-ink' : 'text-canvas'
  const sub = isDark ? 'text-ink/45' : 'text-canvas/55'

  return (
    <span className="flex items-center gap-2.5">
      <span
        className={`grid h-9 w-9 place-items-center rounded-xl text-lg font-bold ${mark}`}
        aria-hidden="true"
      >
        F
      </span>
      <span className="flex flex-col leading-none">
        <span className={`text-[15px] font-semibold tracking-tight ${word}`}>
          Future of Work
        </span>
        {showSub && (
          <span className={`mt-1 text-[11px] tracking-wide ${sub}`}>
            Salone-first marketplace
          </span>
        )}
      </span>
    </span>
  )
}
