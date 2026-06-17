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
    <section id="skills" className="px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm font-medium text-ink/55">
          Explore skills in high demand
        </p>

        <motion.ul
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: reduce ? 0 : 0.06 } },
          }}
          className="mt-8 flex snap-x gap-3 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible"
        >
          {skills.map(({ label, icon: Icon }) => (
            <motion.li
              key={label}
              variants={{
                hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 12 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: EASE_OUT },
                },
              }}
              className="snap-start"
            >
              <span className="group flex shrink-0 cursor-default items-center gap-2.5 rounded-2xl border border-line bg-card px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-ink/25 hover:shadow-md hover:shadow-ink/5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-ink/5 text-ink transition-colors group-hover:bg-ink group-hover:text-canvas">
                  <Icon size={18} />
                </span>
                <span className="whitespace-nowrap text-sm font-medium text-ink">
                  {label}
                </span>
              </span>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
