import Reveal from './Reveal'

/**
 * Who it's for — honest, illustrative personas. No invented names, quotes, or
 * metrics: this is a pre-launch waitlist, so these describe the kind of people
 * we're building for, not real users pretending to review the product.
 */
const people = [
  {
    role: 'Designer',
    place: 'Lagos',
    line: 'Billing her first client abroad — and wants to keep what she earns instead of losing a cut to a middleman.',
  },
  {
    role: 'Developer',
    place: 'Nairobi',
    line: "Done chasing invoices. Wants clear terms up front and money that actually lands when the work is done.",
  },
  {
    role: 'Writer',
    place: 'Accra',
    line: 'Ready to set her own rates instead of taking whatever a client decides to offer.',
  },
  {
    role: 'Student',
    place: 'Freetown',
    line: 'Turning a weekend side hustle into steady, reviewable work he can build a name on.',
  },
]

export default function WhoItsFor() {
  return (
    <section id="who" className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo">
            Who it's for
          </p>
          <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            Real people, all over Africa.
          </h2>
          <p className="mt-4 max-w-md text-ink/55">
            We're still pre-launch, so meet the people we're building for — not
            paid testimonials.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {people.map(({ role, place, line }, i) => (
            <Reveal key={role} delay={i * 0.08}>
              <article className="flex h-full flex-col rounded-2xl border border-line bg-card p-6">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-base font-semibold text-ink">{role}</h3>
                  <span className="text-sm text-ink/45">· {place}</span>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-ink/65">
                  {line}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
