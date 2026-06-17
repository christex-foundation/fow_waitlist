import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { submitWaitlist } from '../lib/api'

const schema = z
  .object({
    name: z.string().trim().min(2, 'Please enter your name'),
    email: z
      .string()
      .trim()
      .email('Enter a valid email')
      .optional()
      .or(z.literal('')),
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
  'w-full rounded-lg border border-fow-ink/15 bg-white px-4 py-3 text-fow-ink outline-none transition focus:border-fow-green focus:ring-2 focus:ring-fow-green/20'

export default function WaitlistForm() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'Freelancer' },
  })

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
    if (result.ok) {
      setSubmitted(true)
    } else {
      setServerError(result.error)
    }
  }

  if (submitted) {
    return (
      <section id="waitlist" className="bg-fow-green">
        <div className="mx-auto max-w-2xl px-5 py-20 text-center text-white">
          <div className="text-5xl" aria-hidden="true">
            🎉
          </div>
          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">You're on the list!</h2>
          <p className="mt-3 text-white/90">
            Thank you for joining Future of Work. We'll be in touch as we get ready
            to launch in Salone.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section id="waitlist" className="bg-fow-green">
      <div className="mx-auto max-w-2xl px-5 py-16 sm:py-20">
        <h2 className="text-center text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Join the waitlist
        </h2>
        <p className="mt-3 text-center text-white/90">
          Be first to know when Future of Work launches. It takes 30 seconds.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-8 space-y-4 rounded-2xl bg-white p-6 shadow-lg sm:p-8"
        >
          <div>
            <label className="block text-sm font-medium text-fow-ink" htmlFor="name">
              Full name
            </label>
            <input id="name" className={inputClass} {...register('name')} />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-fow-ink" htmlFor="role">
              I am a…
            </label>
            <select id="role" className={inputClass} {...register('role')}>
              <option value="Freelancer">Freelancer — I want to offer services</option>
              <option value="Client">Client — I want to hire</option>
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-fow-ink" htmlFor="email">
                Email <span className="text-fow-muted">(optional)</span>
              </label>
              <input
                id="email"
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
              <label className="block text-sm font-medium text-fow-ink" htmlFor="phone">
                Phone <span className="text-fow-muted">(optional)</span>
              </label>
              <input
                id="phone"
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
              <label className="block text-sm font-medium text-fow-ink" htmlFor="skill">
                Skill / what you need{' '}
                <span className="text-fow-muted">(optional)</span>
              </label>
              <input
                id="skill"
                className={inputClass}
                placeholder="e.g. graphic design"
                {...register('skill')}
              />
            </div>
            <div>
              <label
                className="block text-sm font-medium text-fow-ink"
                htmlFor="location"
              >
                Location <span className="text-fow-muted">(optional)</span>
              </label>
              <input
                id="location"
                className={inputClass}
                placeholder="e.g. Freetown"
                {...register('location')}
              />
            </div>
          </div>

          {serverError && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-fow-green px-6 py-3 font-semibold text-white transition hover:bg-fow-green-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Joining…' : 'Join the waitlist'}
          </button>
          <p className="text-center text-xs text-fow-muted">
            We'll only use your details to tell you about Future of Work.
          </p>
        </form>
      </div>
    </section>
  )
}
