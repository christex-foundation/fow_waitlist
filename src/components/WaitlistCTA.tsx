import { useState, type FormEvent } from 'react'
import Reveal from './Reveal'
import { useWaitlist } from '../lib/waitlist-context'

export default function WaitlistCTA() {
  const { open } = useWaitlist()
  const [email, setEmail] = useState('')

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    open(email.trim())
  }

  return (
    <section id="waitlist" className="px-5 py-16 sm:px-8 sm:py-24">
      <Reveal className="mx-auto max-w-6xl">
        <div className="overflow-hidden rounded-[2rem] bg-ink px-6 py-12 text-canvas sm:px-12 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-xl">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Be first in line.
              </h2>
              <p className="mt-4 max-w-md text-canvas/65">
                Join the waitlist and we’ll let you know the moment Future of
                Work opens. One email when it’s time — no spam.
              </p>
              <p className="mt-4 font-serif text-lg italic text-canvas/50">
                Built in Africa, by people who get it.
              </p>
            </div>

            <form
              onSubmit={onSubmit}
              className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto"
            >
              <label htmlFor="cta-email" className="sr-only">
                Email address
              </label>
              <input
                id="cta-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-lg border border-canvas/20 bg-canvas/5 px-5 py-3.5 text-canvas outline-none transition placeholder:text-canvas/40 focus:border-canvas/50 sm:w-72"
              />
              <button
                type="submit"
                className="rounded-lg bg-accent px-6 py-3.5 font-medium text-ink transition-colors hover:bg-accent/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Join the waitlist
              </button>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
