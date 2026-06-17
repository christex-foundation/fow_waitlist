import Reveal from './Reveal'
import Peaks from './Peaks'

const steps = [
  {
    n: '01',
    title: 'Find work',
    body: 'Browse jobs from clients at home and abroad, or set up a profile and let work that fits your skills come to you.',
  },
  {
    n: '02',
    title: 'Agree the terms',
    body: 'Set your rate, scope, and timeline up front. Clear agreements mean no awkward conversations later.',
  },
  {
    n: '03',
    title: 'Get paid',
    body: "The money's held safely from the start and released when the work is done — in Leones or US dollars.",
  },
]

export default function HowItWorks() {
  return (
    <section id="how" className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo">
            How it works
          </p>
          <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            From first job to first payday.
          </h2>
          <p className="mt-4 max-w-md text-ink/60">
            Three steps. No middlemen, no guesswork about when you'll be paid.
          </p>
        </Reveal>

        {/* The Lion Mountains as a range the steps sit beneath. */}
        <Reveal delay={0.05}>
          <Peaks
            variant="line"
            preserveAspectRatio="none"
            strokeWidth={2}
            className="mt-12 h-12 w-full text-indigo/30"
          />
        </Reveal>

        <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-3">
          {steps.map(({ n, title, body }, i) => (
            <Reveal as="li" key={n} delay={i * 0.08}>
              <span className="font-serif text-3xl leading-none text-indigo/40">
                {n}
              </span>
              <h3 className="mt-3 text-xl font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-ink/60">{body}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
