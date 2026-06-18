import Reveal from './Reveal'
import Peaks from './Peaks'

const points = [
  {
    n: '01',
    title: 'Built for how Africa works',
    body: 'Mobile-first and light on data. Get paid in your local currency or US dollars, whichever suits the job.',
  },
  {
    n: '02',
    title: 'You set the terms',
    body: 'Choose your rates and your clients. Clear agreements and protected payments mean you always know what you’ll earn and when it lands.',
  },
  {
    n: '03',
    title: 'A reputation that travels',
    body: 'Reviews and a portfolio that follow you — so local work today turns into clients abroad tomorrow.',
  },
]

export default function WhatSetsUsApart() {
  return (
    <section id="why" className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/50">
            Why Future of Work
          </p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
            Made for the people doing the work.
          </h2>
          <p className="mt-4 max-w-sm text-ink/60">
            No middlemen taking a cut of your hustle — just the tools to get
            hired and get paid.
          </p>
        </Reveal>

        <div>
          {points.map(({ n, title, body }, i) => (
            <Reveal key={n} delay={i * 0.08}>
              <div className="grid grid-cols-[auto_1fr] gap-5 border-t border-line py-6 last:border-b sm:gap-8 sm:py-7">
                <Peaks
                  variant="line"
                  strokeWidth={3}
                  className="mt-1.5 h-5 w-10 text-indigo/45"
                />
                <div>
                  <h3 className="text-lg font-semibold text-ink sm:text-xl">
                    {title}
                  </h3>
                  <p className="mt-2 max-w-md text-ink/60">{body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
