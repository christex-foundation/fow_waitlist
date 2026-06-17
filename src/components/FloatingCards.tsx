import { motion, useReducedMotion } from 'motion/react'
import { EASE_OUT } from '../lib/motion'

/**
 * Honest pinned badges over the hero portrait.
 * No fabricated metrics — this is a pre-launch waitlist. Each line is true today.
 */
const badges = [
  { text: 'Made in Sierra Leone', dot: '#2d9c5a', pos: 'left-0 top-8 sm:-left-6' },
  { text: 'Get paid in Le or USD', dot: '#f7901e', pos: 'right-0 top-1/3 sm:-right-6' },
  { text: 'Launching 2026', dot: '#1c1c1c', pos: 'bottom-14 left-2 sm:-left-4' },
]

export default function HeroBadges() {
  const reduce = useReducedMotion()

  return (
    <>
      {badges.map(({ text, dot, pos }, i) => (
        <motion.div
          key={text}
          className={`absolute ${pos} flex items-center gap-2 rounded-xl border border-line bg-card/95 px-3.5 py-2.5 text-[13px] font-medium text-ink shadow-lg shadow-ink/5 backdrop-blur-sm`}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 + i * 0.15, ease: EASE_OUT }}
        >
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ background: dot }}
            aria-hidden="true"
          />
          {text}
        </motion.div>
      ))}
    </>
  )
}
