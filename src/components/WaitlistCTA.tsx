import { useState, type FormEvent } from 'react'
import { ArrowRight } from 'lucide-react'
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
    <section id="waitlist" className="px-5 py-20 sm:px-8 sm:py-28">
      <Reveal className="mx-auto max-w-3xl text-center">
        <h2 className="text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          Join the waitlist and get{' '}
          <span className="font-serif font-normal italic">early access</span>.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-ink/60">
          Drop your email to start. We'll ask a couple of quick questions, then keep
          you posted as we launch.
        </p>

        <form
          onSubmit={onSubmit}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row sm:items-center sm:rounded-full sm:border sm:border-line sm:bg-card sm:p-1.5 sm:shadow-sm"
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
            className="w-full rounded-full border border-line bg-card px-5 py-3.5 text-ink outline-none transition placeholder:text-ink/35 focus:border-ink/40 focus:ring-4 focus:ring-ink/5 sm:flex-1 sm:border-0 sm:bg-transparent sm:py-2.5 sm:focus:ring-0"
          />
          <button
            type="submit"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 font-medium text-canvas transition hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink sm:py-3"
          >
            Join the waitlist
            <ArrowRight
              size={18}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </form>
      </Reveal>
    </section>
  )
}
