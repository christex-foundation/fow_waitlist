import { motion, useReducedMotion, type Variants } from 'motion/react'
import { EASE_OUT } from '../lib/motion'
import { useWaitlist } from '../lib/waitlist-context'
import HeroBadges from './FloatingCards'

export default function Hero() {
  const { open } = useWaitlist()
  const reduce = useReducedMotion()

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: 0.05 },
    },
  }

  const rise: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.3 : 0.6, ease: EASE_OUT },
    },
  }

  const stage: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.3 : 0.8, ease: EASE_OUT },
    },
  }

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-10 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8 lg:pb-16">
        {/* Left: editorial copy, left-aligned */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="max-w-xl"
        >
          <motion.p
            variants={rise}
            className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/50"
          >
            Sierra Leone's freelance marketplace
          </motion.p>

          <motion.h1
            variants={rise}
            className="mt-5 text-balance text-4xl font-semibold leading-[1.03] tracking-tight text-ink sm:text-6xl"
          >
            Freelance work,
            <br className="hidden sm:block" /> built for{' '}
            <span className="relative inline-block">
              <span
                aria-hidden="true"
                className="absolute inset-x-[-0.08em] bottom-[0.08em] h-[0.42em] -rotate-1 bg-accent/70"
              />
              <span className="relative">Salone</span>
            </span>
            .
          </motion.h1>

          <motion.p
            variants={rise}
            className="mt-6 max-w-md text-lg leading-relaxed text-ink/65"
          >
            Future of Work connects Sierra Leonean freelancers with clients at
            home and abroad. Set your rates, get paid reliably, and build a name
            that opens doors.
          </motion.p>

          <motion.div variants={rise} className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => open()}
              className="inline-flex items-center justify-center rounded-lg bg-ink px-6 py-3.5 text-sm font-medium text-canvas transition-colors hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Join the waitlist
            </button>
            <a
              href="#why"
              className="inline-flex items-center justify-center rounded-lg border border-ink/20 px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:border-ink/40 hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              How it works
            </a>
          </motion.div>

          <motion.p variants={rise} className="mt-5 text-sm text-ink/45">
            Free to join · No fees to apply · Launching 2026
          </motion.p>
        </motion.div>

        {/* Right: portrait on a warm panel with honest pinned badges */}
        <motion.div
          variants={stage}
          initial="hidden"
          animate="show"
          className="relative mx-auto flex h-[380px] w-full max-w-md items-end justify-center sm:h-[480px] lg:mx-0"
        >
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-1/2 -z-10 h-[92%] w-[90%] -translate-x-1/2 rounded-[2.5rem] bg-accent/15"
          />

          <img
            src="/hero-portrait.png"
            alt="A freelancer in Freetown reviewing work on her phone"
            className="h-full w-auto select-none object-contain object-bottom"
            draggable={false}
          />

          <HeroBadges />
        </motion.div>
      </div>
    </section>
  )
}
