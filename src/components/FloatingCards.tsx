import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Star, TrendingUp } from 'lucide-react'

/** A card that drifts gently in place; still under reduced-motion. */
function Float({
  children,
  className,
  delay = 0,
  range = 8,
}: {
  children: ReactNode
  className?: string
  delay?: number
  range?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={`absolute rounded-2xl border border-line bg-card/95 shadow-xl shadow-ink/10 backdrop-blur-sm ${className ?? ''}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={
        reduce
          ? { opacity: 1, scale: 1 }
          : { opacity: 1, scale: 1, y: [0, -range, 0] }
      }
      transition={
        reduce
          ? { duration: 0.4, delay }
          : {
              opacity: { duration: 0.5, delay },
              scale: { duration: 0.5, delay },
              y: { duration: 5 + range / 4, repeat: Infinity, ease: 'easeInOut', delay },
            }
      }
    >
      {children}
    </motion.div>
  )
}

const avatars = ['#C9B79C', '#8FA8A0', '#B98A6E']

export default function FloatingCards() {
  return (
    <>
      {/* Top-rated badge — upper left */}
      <Float className="left-0 top-6 px-3.5 py-2.5 sm:-left-4" delay={0.5} range={7}>
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-xs font-semibold text-canvas">
            AK
          </span>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold text-ink">Top Rated</div>
            <div className="text-[11px] text-ink/55">Designer · Freetown</div>
          </div>
        </div>
      </Float>

      {/* Earnings card — upper right */}
      <Float className="right-0 top-16 px-4 py-3.5 sm:-right-4" delay={0.7} range={10}>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-ink/55">
          <TrendingUp size={13} /> Total earned
        </div>
        <div className="mt-1 text-lg font-semibold tracking-tight text-ink">
          Le 22,800,000
        </div>
        <div className="mt-1 text-[11px] font-medium text-emerald-700">
          +18% this month
        </div>
      </Float>

      {/* Rating / trust card — lower right */}
      <Float className="bottom-10 right-2 px-4 py-3 sm:right-0" delay={0.9} range={8}>
        <div className="flex items-center gap-0.5 text-amber-500">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
          ))}
        </div>
        <div className="mt-1.5 flex items-center gap-2">
          <div className="flex -space-x-2">
            {avatars.map((c, i) => (
              <span
                key={i}
                className="h-6 w-6 rounded-full border-2 border-card"
                style={{ background: c }}
              />
            ))}
          </div>
          <span className="text-[11px] text-ink/60">Trusted by 1,200+</span>
        </div>
      </Float>
    </>
  )
}
