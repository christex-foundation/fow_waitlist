import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Check, X } from 'lucide-react'
import { submitWaitlist } from '../lib/api'
import { EASE_OUT } from '../lib/motion'

const schema = z
  .object({
    name: z.string().trim().min(2, 'Please enter your name'),
    email: z.string().trim().email('Enter a valid email').optional().or(z.literal('')),
    phone: z.string().trim().optional().or(z.literal('')),
    role: z.enum(['Freelancer', 'Client']),
    skill: z.string().trim().optional().or(z.literal('')),
    location: z.string().trim().optional().or(z.literal('')),
  })
  .refine((d) => Boolean(d.email) || Boolean(d.phone), {
    message: 'Add an email or a phone number so we can reach you',
    path: ['phone'],
  })

type FormValues = z.infer<typeof schema>

const inputClass =
  'w-full rounded-xl border border-line bg-canvas/50 px-4 py-3 text-ink outline-none transition placeholder:text-ink/35 focus:border-ink/40 focus:ring-4 focus:ring-ink/5'

const labelClass = 'block text-sm font-medium text-ink/80'

type ModalProps = {
  isOpen: boolean
  prefillEmail: string
  onClose: () => void
}

/**
 * The full waitlist form. Mounted fresh on each open (keyed by the provider),
 * so submission state starts clean without resetting inside an effect.
 */
export default function WaitlistModal({ isOpen, prefillEmail, onClose }: ModalProps) {
  const reduce = useReducedMotion()
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'Freelancer', email: prefillEmail },
  })

  // Lock scroll, move focus into the dialog, and restore it on close.
  useEffect(() => {
    if (!isOpen) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => setFocus('name'), 50)
    return () => {
      clearTimeout(t)
      document.body.style.overflow = ''
      previouslyFocused?.focus?.()
    }
  }, [isOpen, setFocus])

  // ESC to close + a basic focus trap within the panel.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab' || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  const onSubmit = async (values: FormValues) => {
    setServerError(null)
    const result = await submitWaitlist({
      name: values.name,
      email: values.email || undefined,
      phone: values.phone || undefined,
      role: values.role,
      skill: values.skill || undefined,
      location: values.location || undefined,
    })
    if (result.ok) setSubmitted(true)
    else setServerError(result.error)
  }

  const dur = reduce ? 0 : 0.35

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: dur }}
        >
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="waitlist-title"
            className="relative z-10 w-full max-w-lg rounded-3xl bg-card p-6 shadow-2xl shadow-ink/20 sm:p-8"
            initial={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 24, scale: reduce ? 1 : 0.98 }}
            transition={{ duration: dur, ease: EASE_OUT }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-ink/50 transition hover:bg-ink/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              <X size={18} />
            </button>

            {submitted ? (
              <div className="py-6 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ink text-canvas">
                  <Check size={26} />
                </div>
                <h2 className="mt-5 font-serif text-3xl italic text-ink">
                  You're on the list
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-ink/65">
                  Thanks for joining. We'll reach out as Future of Work gets ready to
                  launch in Salone.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-6 rounded-full bg-ink px-6 py-3 font-medium text-canvas transition hover:bg-ink/85"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h2 id="waitlist-title" className="pr-8 text-2xl font-semibold text-ink">
                  Join the waitlist
                </h2>
                <p className="mt-2 text-ink/60">
                  Tell us a little about you. It takes about 30 seconds.
                </p>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                  className="mt-6 space-y-4"
                >
                  <div>
                    <label className={labelClass} htmlFor="w-name">
                      Full name
                    </label>
                    <input id="w-name" className={inputClass} {...register('name')} />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="w-role">
                      I am a…
                    </label>
                    <select id="w-role" className={inputClass} {...register('role')}>
                      <option value="Freelancer">Freelancer — I want to offer services</option>
                      <option value="Client">Client — I want to hire</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass} htmlFor="w-email">
                        Email <span className="text-ink/40">(optional)</span>
                      </label>
                      <input
                        id="w-email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        className={inputClass}
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="w-phone">
                        Phone <span className="text-ink/40">(optional)</span>
                      </label>
                      <input
                        id="w-phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="+232…"
                        className={inputClass}
                        {...register('phone')}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass} htmlFor="w-skill">
                        Skill / need <span className="text-ink/40">(optional)</span>
                      </label>
                      <input
                        id="w-skill"
                        className={inputClass}
                        placeholder="e.g. graphic design"
                        {...register('skill')}
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="w-location">
                        Location <span className="text-ink/40">(optional)</span>
                      </label>
                      <input
                        id="w-location"
                        className={inputClass}
                        placeholder="e.g. Freetown"
                        {...register('location')}
                      />
                    </div>
                  </div>

                  {serverError && (
                    <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                      {serverError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-ink px-6 py-3.5 font-medium text-canvas transition hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? 'Joining…' : 'Join the waitlist'}
                  </button>
                  <p className="text-center text-xs text-ink/50">
                    We'll only use your details to tell you about Future of Work.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
