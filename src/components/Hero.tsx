import { motion, useReducedMotion, type Variants } from 'motion/react'
import { ArrowRight } from 'lucide-react'
import { EASE_OUT } from '../lib/motion'
import { useWaitlist } from '../lib/waitlist-context'

export default function Hero() {
  const { open } = useWaitlist()
  const reduce = useReducedMotion()

  const container: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : 0.12, delayChildren: 0.08 },
    },
  }

  // Editorial clip-reveal: each display line rises from its own baseline.
  const line: Variants = {
    hidden: reduce ? { opacity: 0 } : { y: '110%' },
    show: {
      y: '0%',
      opacity: 1,
      transition: { duration: reduce ? 0.3 : 0.85, ease: EASE_OUT },
    },
  }
  const arrow: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, scale: 0.92, rotate: -4 },
    show: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: { duration: reduce ? 0.3 : 0.9, ease: EASE_OUT },
    },
  }
  const cluster: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.3 : 0.7, ease: EASE_OUT },
    },
  }

  return (
    <section id="top" className="relative isolate overflow-hidden bg-canvas">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-[1500px] flex-col justify-center px-5 pb-10 pt-6 sm:px-8"
      >
        {/* Signature: a bold "growth" composition — a thick vertical shaft on
            the left that widens into a solid base block, plus a chunky diagonal
            arrow whose tip reaches into the top-right corner. The headline
            sits over the orange. */}
        <motion.svg
          variants={arrow}
          aria-hidden="true"
          viewBox="0 0 120 120"
          preserveAspectRatio="xMidYMid slice"
          className="pointer-events-none absolute right-0 top-0 z-0 h-[48%] w-auto text-accent opacity-90 sm:h-[58%] lg:inset-y-0 lg:h-full lg:opacity-100"
        >
          {/* vertical shaft + solid base block */}
          <path fill="currentColor" d="M4 14 H42 V82 H102 V120 H4 Z" />
          {/* chunky diagonal arrow pointing into the top-right corner */}
          <path
            fill="currentColor"
            d="M112 16 L69.6 16 L83 29.4 L42.2 74.2 L57.8 89.8 L98.6 45 L112 58.4 Z"
          />
        </motion.svg>

        {/* Giant FUTURE / OF / WORK lockup */}
        <h1
          aria-label="Future of Work"
          className="relative z-10 select-none font-black uppercase leading-[0.82] tracking-[-0.045em] text-ink"
          style={{ fontSize: 'clamp(2.75rem, 14vw, 11.5rem)' }}
        >
          {['Future', 'Of', 'Work'].map((word, i) => (
            <span
              key={word}
              aria-hidden="true"
              className={
                'block overflow-hidden' + (i === 2 ? ' lg:pl-[40%]' : '')
              }
            >
              <motion.span variants={line} className="block">
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        {/* Bottom-left cluster: pitch + paired CTAs */}
        <motion.div
          variants={cluster}
          className="relative z-10 mt-9 max-w-sm sm:mt-12 lg:absolute lg:bottom-[7%] lg:left-8 lg:mt-0"
        >
          <p className="text-base font-bold text-ink sm:text-lg">
            Sierra Leone's freelance marketplace.
          </p>
          <p className="mt-1.5 text-sm leading-snug text-ink/70 sm:text-base">
            Connect local talent with real opportunity — earn, grow, and build a
            name that travels.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => open()}
              className="group inline-flex items-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-medium text-canvas transition hover:bg-ink/85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Join the waitlist
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
            <a
              href="#why"
              className="inline-flex items-center rounded-lg border border-ink/25 px-5 py-3 text-sm font-medium text-ink transition hover:border-ink/50 hover:bg-ink/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              See how it works
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
