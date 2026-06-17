import {
  Palette,
  Code2,
  Megaphone,
  PenLine,
  Clapperboard,
  Briefcase,
  Headphones,
  type LucideIcon,
} from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { EASE_OUT } from '../lib/motion'

const skills: { label: string; icon: LucideIcon }[] = [
  { label: 'Design', icon: Palette },
  { label: 'Development', icon: Code2 },
  { label: 'Marketing', icon: Megaphone },
  { label: 'Writing', icon: PenLine },
  { label: 'Video & Motion', icon: Clapperboard },
  { label: 'Business', icon: Briefcase },
  { label: 'Support', icon: Headphones },
]

export default function SkillsRow() {
  const reduce = useReducedMotion()

  return (
    <section id="skills" className="px-5 py-14 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
            Skills in demand
          </h2>
          <p className="text-sm text-ink/55">
            Whatever you do best, there’s work for it.
          </p>
        </div>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: reduce ? 0 : 0.05 } },
          }}
          className="mt-8 flex flex-wrap gap-2.5"
        >
          {skills.map(({ label, icon: Icon }) => (
            <motion.li
              key={label}
              variants={{
                hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 10 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.45, ease: EASE_OUT },
                },
              }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-card px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:border-ink/40">
                <Icon size={16} className="text-ink/45" />
                {label}
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
