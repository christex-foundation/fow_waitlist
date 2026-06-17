import { motion, useReducedMotion, type Variants } from 'motion/react'
import { EASE_OUT } from '../lib/motion'
import { useWaitlist } from '../lib/waitlist-context'
import HeroFacts from './FloatingCards'
import Peaks from './Peaks'

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
            className="text-sm font-semibold uppercase tracking-[0.18em] text-ink/50"
          >
            Sierra Leone's freelance marketplace
          </motion.p>

          <motion.h1
            variants={rise}
            className="mt-5 text-balance text-6xl font-semibold leading-[0.98] tracking-[-0.02em] text-ink sm:text-[5.25rem]"
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
            className="mt-6 max-w-lg text-xl leading-relaxed text-ink/65"
          >
            Future of Work connects Sierra Leonean freelancers with clients at
            home and abroad. Set your rates, get paid reliably, and build a name
            that opens doors.
          </motion.p>

          <motion.div variants={rise} className="mt-8 flex flex-wrap items-center gap-3">
            <motion.button
              type="button"
              onClick={() => open()}
              initial="rest"
              animate="rest"
              whileHover={reduce ? undefined : 'hover'}
              whileTap={reduce ? undefined : { scale: 0.98 }}
              variants={reduce ? undefined : { rest: { scale: 1 }, hover: { scale: 1.03 } }}
              className="relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-ink px-7 py-4 text-base font-medium text-canvas transition-colors hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              {!reduce && (
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-canvas/45 to-transparent"
                  initial={{ x: '-150%' }}
                  animate={{ x: '450%' }}
                  transition={{
                    duration: 0.9,
                    ease: EASE_OUT,
                    repeat: Infinity,
                    repeatDelay: 2.2,
                  }}
                />
              )}
              <span className="relative">Join the waitlist</span>
            </motion.button>
            <a
              href="#how"
              className="inline-flex items-center justify-center rounded-lg border border-ink/20 px-7 py-4 text-base font-medium text-ink transition-colors hover:border-ink/40 hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              How it works
            </a>
          </motion.div>

          <motion.p variants={rise} className="mt-5 text-sm text-ink/45">
            Free to join · No fees to apply · Launching 2026
          </motion.p>
        </motion.div>

        {/* Right: portrait framed by the Lion Mountains, with honest facts below */}
        <motion.div
          variants={stage}
          initial="hidden"
          animate="show"
          className="mx-auto w-full max-w-lg lg:mx-0"
        >
          <div className="relative flex h-[440px] w-full items-end justify-center sm:h-[560px]">
            {/* Signature: the Freetown hills rising behind her — a tinted
                silhouette with a hand-drawn ridge sketched over it. */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 -z-10 h-[62%]"
            >
              <Peaks
                variant="fill"
                preserveAspectRatio="none"
                className="absolute bottom-0 left-1/2 h-full w-[112%] -translate-x-1/2 text-indigo/12"
              />
              <Peaks
                variant="line"
                preserveAspectRatio="none"
                strokeWidth={2}
                className="absolute bottom-0 left-1/2 h-full w-[112%] -translate-x-1/2 text-indigo/30"
              />
            </div>

            <img
              src="/hero-portrait.png"
              alt="A freelancer in Freetown reviewing work on her phone"
              className="h-full w-auto select-none object-contain object-bottom"
              draggable={false}
            />

            {/* A photo caption, not a metric. */}
            <figcaption className="pointer-events-none absolute bottom-3 left-3 font-serif text-sm italic text-ink/55">
              Freetown · 2026
            </figcaption>
          </div>

          <div className="mt-6">
            <HeroFacts />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
