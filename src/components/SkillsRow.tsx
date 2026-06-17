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

const skills: { label: string; eg: string; icon: LucideIcon }[] = [
  { label: 'Design', eg: 'Logos, gara-print patterns, brand kits', icon: Palette },
  { label: 'Development', eg: 'Websites, mobile apps, quick fixes', icon: Code2 },
  { label: 'Marketing', eg: 'Social media, campaigns, ads', icon: Megaphone },
  { label: 'Writing', eg: 'Articles, copy, translation', icon: PenLine },
  { label: 'Video & Motion', eg: 'Edits, reels, animation', icon: Clapperboard },
  { label: 'Business', eg: 'Admin, bookkeeping, research', icon: Briefcase },
  { label: 'Support', eg: 'Virtual assistance, customer care', icon: Headphones },
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
          className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {skills.map(({ label, eg, icon: Icon }) => (
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
              className="group flex items-start gap-3 rounded-2xl border border-line bg-card px-4 py-3.5 transition-colors hover:border-indigo/40"
            >
              <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo/8 text-indigo transition-colors group-hover:bg-indigo/15">
                <Icon size={17} />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-ink">{label}</span>
                <span className="mt-0.5 text-[13px] leading-snug text-ink/50">
                  {eg}
                </span>
              </span>
            </motion.li>
          ))}

          <motion.li
            variants={{
              hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 10 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.45, ease: EASE_OUT },
              },
            }}
            className="flex items-center justify-center rounded-2xl border border-dashed border-ink/20 px-4 py-3.5 text-sm font-medium text-ink/55"
          >
            + your skill
          </motion.li>
        </motion.ul>
      </div>
    </section>
  )
}
