import { Zap, ShieldCheck, Sprout, type LucideIcon } from 'lucide-react'
import Reveal from './Reveal'

const features: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: 'Fast opportunities',
    body: 'Set up a profile in minutes and get matched to work that fits your skills, not the other way around.',
    icon: Zap,
  },
  {
    title: 'Secure & fair',
    body: 'Clear terms and protected payments, so you always know what you earn and when it lands.',
    icon: ShieldCheck,
  },
  {
    title: 'Grow your future',
    body: 'Build a track record clients trust, take on bigger work, and reach buyers at home and abroad.',
    icon: Sprout,
  },
]

export default function WhatSetsUsApart() {
  return (
    <section id="why" className="px-5 py-8 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl rounded-[2rem] border border-line bg-card px-6 py-12 sm:px-12 sm:py-16">
        <Reveal>
          <p className="text-sm font-medium text-ink/55">Why Future of Work</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            What sets us{' '}
            <span className="font-serif font-normal italic">apart</span>
          </h2>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-3">
          {features.map(({ title, body, icon: Icon }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <div className="border-t border-line pt-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink text-canvas">
                  <Icon size={20} />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{title}</h3>
                <p className="mt-2 text-ink/60">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
