/**
 * Honest facts under the hero portrait — a quiet inline strip, not floating
 * glass chips. No fabricated metrics: this is a pre-launch waitlist, so every
 * line here is true today.
 */
const facts = [
  { text: 'Built in Africa', dot: '#2b2a6b' },
  { text: 'Local currency or USD', dot: '#f7901e' },
  { text: 'Launching 2026', dot: '#2d9c5a' },
]

export default function HeroFacts() {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
      {facts.map(({ text, dot }) => (
        <li
          key={text}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-ink/55"
        >
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: dot }}
            aria-hidden="true"
          />
          {text}
        </li>
      ))}
    </ul>
  )
}
