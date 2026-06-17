import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { EASE_OUT } from '../lib/motion'

type RevealProps = {
  children: ReactNode
  /** Seconds of delay before the reveal starts. */
  delay?: number
  /** Pixels the element rises from. */
  y?: number
  className?: string
  /** Render as a different element (e.g. 'li', 'section'). */
  as?: 'div' | 'section' | 'li' | 'span'
}

/**
 * Fades + rises its children into view the first time they're scrolled near.
 * Falls back to a plain, instant element when the user prefers reduced motion.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  as = 'div',
}: RevealProps) {
  const reduce = useReducedMotion()
  const Comp = motion[as]

  if (reduce) {
    const Plain = as
    return <Plain className={className}>{children}</Plain>
  }

  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay }}
    >
      {children}
    </Comp>
  )
}
