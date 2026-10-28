import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, Check, X } from 'lucide-react'
import { submitWaitlist, type WaitlistPayload } from '../lib/api'
import { EASE_OUT } from '../lib/motion'

const interestAreas = ['Media', 'Software Engineering', 'Operations & Strategy'] as const
type InterestArea = (typeof interestAreas)[number]

const supportOptions = [
  'Understanding possible careers',
  'Identifying my strengths',
  'Learning practical skills',
  'Finding internships or volunteering opportunities',
  'Finding paid work',
  'Improving how I present my experience',
]

const tracks: Record<
  InterestArea,
  {
    intro: string
    activityQuestion: string
    activities: string[]
    experienceQuestion: string
    experienceHint: string
    scenarioQuestion: string
    toolsQuestion: string
    tools: string[]
    supportQuestion: string
    desk: string
  }
> = {
  Media: {
    intro:
      'Media involves creating and sharing content to inform, engage, or promote ideas. This includes photography, video production, graphic design, writing, and social media.',
    activityQuestion: 'Which of these activities would you most enjoy?',
    activities: [
      'Taking photographs',
      'Recording or editing videos',
      'Designing graphics or flyers',
      'Writing stories or promotional content',
      'Creating or managing social media content',
      'Not sure yet',
    ],
    experienceQuestion: 'Briefly describe any media content you’ve created before.',
    experienceHint:
      'This can include personal projects, school, volunteering, or paid work. If you have not created any yet, write “None yet.”',
    scenarioQuestion:
      'You are asked to create a social media post promoting a student event. What would you ask the organiser before starting?',
    toolsQuestion: 'Which tools have you used to create or manage content?',
    tools: [
      'Canva',
      'CapCut or other video-editing apps',
      'Adobe tools, such as Photoshop or Premiere Pro',
      'Phone camera or photo-editing apps',
      'Social media publishing or scheduling tools',
      'None yet',
      'Other',
    ],
    supportQuestion: 'What would you like to support in Media?',
    desk: 'Media',
  },
  'Software Engineering': {
    intro:
      'Engineering involves using technology to build solutions and solve problems. This includes developing websites and apps, working with data and AI, setting up computer systems, and exploring electronics or robotics.',
    activityQuestion: 'Which of these activities would you most enjoy?',
    activities: [
      'Building websites or apps',
      'Working with data or AI',
      'Setting up or fixing computers and networks',
      'Building or experimenting with electronics and robotics',
      'Solving technical problems',
      'Not sure yet',
    ],
    experienceQuestion: 'Have you built, fixed, or worked on a technical project before?',
    experienceHint:
      'This can include school, personal projects, volunteering, or paid work.',
    scenarioQuestion:
      'A website or app you use stops working properly. What would you check first, and why?',
    toolsQuestion: 'Which tools or technologies have you used?',
    tools: [
      'Programming languages, such as Python or JavaScript',
      'Website builders, such as WordPress',
      'AI or no-code tools for building apps or websites',
      'Data tools, such as Excel, SQL, or Power BI',
      'Computer repair or networking tools',
      'Electronics or robotics kits, such as Arduino',
      'None yet',
      'Other',
    ],
    supportQuestion: 'What would you most like support with in Engineering?',
    desk: 'Engineering',
  },
  'Operations & Strategy': {
    intro:
      'Operations & Strategy involves helping an organisation plan activities, organise people and resources, solve problems, and get things done.',
    activityQuestion: 'Which of these activities would you most enjoy?',
    activities: [
      'Planning events or projects',
      'Organising tasks and schedules',
      'Researching information',
      'Solving organisational problems',
      'Tracking expenses or resources',
      'Helping a team work together',
      'Not sure yet',
    ],
    experienceQuestion: 'Have you helped organise an activity, project, business, or group before?',
    experienceHint:
      'This can include school, volunteering, community activities, or personal projects.',
    scenarioQuestion:
      'A student group is organising an event next week, but tasks have not been assigned and the budget is limited. What would you do first, and why?',
    toolsQuestion: 'Which tools have you used to organise information or manage tasks?',
    tools: [
      'Excel or Google Sheets',
      'Word or Google Docs',
      'Calendars or to-do lists',
      'Project-management tools, such as Trello, Notion, or Asana',
      'Paper or notebooks',
      'None yet',
      'Other',
    ],
    supportQuestion: 'What would you most like support with in Operations & Strategy?',
    desk: 'Operations & Strategy',
  },
}

const detailsSchema = z
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

const assessmentSchema = z
  .object({
    interestArea: z.enum(interestAreas, { error: 'Choose an area of interest' }),
    activityInterests: z
      .array(z.string())
      .min(1, 'Choose at least one activity')
      .max(2, 'Choose up to two activities'),
    previousExperience: z.enum(['Yes', 'No', '']),
    experienceDescription: z.string(),
    scenarioResponse: z.string().trim().min(1, 'Please answer this question'),
    toolsUsed: z.array(z.string()).min(1, 'Choose at least one option'),
    otherTool: z.string(),
    supportNeeded: z.string().trim().min(1, 'Choose one option'),
  })
  .superRefine((answers, context) => {
    if (answers.interestArea === 'Media') {
      if (!answers.experienceDescription.trim()) {
        context.addIssue({
          code: 'custom',
          path: ['experienceDescription'],
          message: 'Please describe your experience, or write “None yet.”',
        })
      }
    } else if (!answers.previousExperience) {
      context.addIssue({
        code: 'custom',
        path: ['previousExperience'],
        message: 'Choose Yes or No',
      })
    } else if (
      answers.previousExperience === 'Yes' &&
      !answers.experienceDescription.trim()
    ) {
      context.addIssue({
        code: 'custom',
        path: ['experienceDescription'],
        message: 'Please briefly describe what you did',
      })
    }

    if (answers.toolsUsed.includes('Other') && !answers.otherTool.trim()) {
      context.addIssue({
        code: 'custom',
        path: ['otherTool'],
        message: 'Tell us which other tool you have used',
      })
    }
  })

type FormValues = z.infer<typeof detailsSchema>
type AssessmentValues = {
  interestArea: InterestArea | ''
  activityInterests: string[]
  previousExperience: 'Yes' | 'No' | ''
  experienceDescription: string
  scenarioResponse: string
  toolsUsed: string[]
  otherTool: string
  supportNeeded: string
}

function emptyAssessment(interestArea: InterestArea | '' = ''): AssessmentValues {
  return {
    interestArea,
    activityInterests: [],
    previousExperience: '',
    experienceDescription: '',
    scenarioResponse: '',
    toolsUsed: [],
    otherTool: '',
    supportNeeded: '',
  }
}

const inputClass =
  'w-full rounded-xl border border-line bg-canvas/50 px-4 py-3 text-ink outline-none transition placeholder:text-ink/35 focus:border-ink/40 focus:ring-4 focus:ring-ink/5'

const textareaClass = `${inputClass} min-h-28 resize-y`
const labelClass = 'block text-sm font-medium text-ink/80'

type CheckboxQuestionProps = {
  id: string
  label: string
  options: string[]
  selected: string[]
  error?: string
  onToggle: (option: string) => void
}

function CheckboxQuestion({
  id,
  label,
  options,
  selected,
  error,
  onToggle,
}: CheckboxQuestionProps) {
  return (
    <fieldset aria-describedby={error ? `${id}-error` : undefined}>
      <legend className={labelClass}>{label}</legend>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const checked = selected.includes(option)
          return (
            <label
              key={option}
              className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3 py-3 text-sm transition ${
                checked
                  ? 'border-ink/30 bg-ink/5 text-ink'
                  : 'border-line bg-canvas/30 text-ink/75 hover:bg-canvas/70'
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(option)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                aria-invalid={Boolean(error)}
              />
              <span>{option}</span>
            </label>
          )
        })}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </fieldset>
  )
}

type ModalProps = {
  isOpen: boolean
  prefillEmail: string
  onClose: () => void
}

/**
 * The waitlist details and skills assessment share one submission. The modal
 * stays mounted between steps so the original waitlist answers are preserved.
 */
export default function WaitlistModal({ isOpen, prefillEmail, onClose }: ModalProps) {
  const reduce = useReducedMotion()
  const [step, setStep] = useState<'details' | 'assessment'>('details')
  const [assessment, setAssessment] = useState<AssessmentValues>(() => emptyAssessment())
  const [assessmentAttempted, setAssessmentAttempted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(detailsSchema),
    defaultValues: { role: 'Freelancer', email: prefillEmail },
  })

  const assessmentResult = assessmentAttempted
    ? assessmentSchema.safeParse(assessment)
    : undefined
  const assessmentErrors = assessmentResult && !assessmentResult.success
    ? assessmentResult.error.issues
    : []
  const assessmentError = (field: keyof AssessmentValues) =>
    assessmentErrors.find((issue) => issue.path[0] === field)?.message

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

  useEffect(() => {
    if (isOpen) headingRef.current?.focus()
  }, [isOpen, step])

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

  const toggleAssessmentChoice = (
    field: 'activityInterests' | 'toolsUsed',
    option: string,
  ) => {
    const exclusiveOption = field === 'activityInterests' ? 'Not sure yet' : 'None yet'
    const maxChoices = field === 'activityInterests' ? 2 : undefined
    setAssessment((current) => {
      const currentChoices = current[field]
      if (currentChoices.includes(option)) {
        return { ...current, [field]: currentChoices.filter((choice) => choice !== option) }
      }
      if (option === exclusiveOption) return { ...current, [field]: [option] }

      const choices = currentChoices.filter((choice) => choice !== exclusiveOption)
      if (maxChoices && choices.length >= maxChoices) return current
      return { ...current, [field]: [...choices, option] }
    })
  }

  const onSubmit = async (values: FormValues) => {
    if (step === 'details') {
      setServerError(null)
      setStep('assessment')
      return
    }

    setAssessmentAttempted(true)
    setServerError(null)
    const result = assessmentSchema.safeParse(assessment)
    if (!result.success) return

    const area = result.data.interestArea as InterestArea
    const assessmentAnswers: WaitlistPayload['assessmentAnswers'] = {
      activityInterests: result.data.activityInterests,
      experienceDescription: result.data.experienceDescription.trim(),
      scenarioResponse: result.data.scenarioResponse.trim(),
      toolsUsed: result.data.toolsUsed,
      supportNeeded: result.data.supportNeeded,
      ...(area !== 'Media'
        ? { previousExperience: result.data.previousExperience as 'Yes' | 'No' }
        : {}),
      ...(result.data.toolsUsed.includes('Other')
        ? { otherTool: result.data.otherTool.trim() }
        : {}),
    }

    const response = await submitWaitlist({
      name: values.name,
      email: values.email || undefined,
      phone: values.phone || undefined,
      role: values.role,
      skill: values.skill || undefined,
      location: values.location || undefined,
      interestArea: area,
      assessmentAnswers,
    })

    if (response.ok) setSubmitted(true)
    else setServerError(response.error)
  }

  const dur = reduce ? 0 : 0.35
  const selectedTrack = assessment.interestArea ? tracks[assessment.interestArea] : null

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
            className="relative z-10 max-h-[calc(100dvh-2rem)] w-full max-w-lg overflow-y-auto rounded-3xl bg-card p-6 shadow-2xl shadow-ink/20 sm:p-8"
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
                  Thanks for joining. We’ll reach out as Future of Work gets ready to
                  launch.
                </p>
                {selectedTrack && (
                  <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-ink/65">
                    Your next step: Visit the {selectedTrack.desk} desk. Our team will
                    discuss your interests and responses with you and help you identify
                    skills to develop and opportunities to explore.
                  </p>
                )}
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
                <h2
                  id="waitlist-title"
                  ref={headingRef}
                  tabIndex={-1}
                  className="pr-8 text-2xl font-semibold text-ink outline-none"
                >
                  {step === 'details' ? 'Join the waitlist' : 'Skills assessment'}
                </h2>
                <p className="mt-2 text-ink/60">
                  {step === 'details'
                    ? 'Tell us a little about you. It takes about 30 seconds.'
                    : 'Choose an area of interest, then answer the questions for that track.'}
                </p>

                <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
                  {step === 'details' ? (
                    <>
                      <div>
                        <label className={labelClass} htmlFor="w-name">
                          Full name
                        </label>
                        <input
                          id="w-name"
                          className={inputClass}
                          aria-invalid={Boolean(errors.name)}
                          aria-describedby={errors.name ? 'w-name-error' : undefined}
                          {...register('name')}
                        />
                        {errors.name && (
                          <p id="w-name-error" role="alert" className="mt-1 text-sm text-red-600">
                            {errors.name.message}
                          </p>
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
                            aria-invalid={Boolean(errors.email)}
                            aria-describedby={errors.email ? 'w-email-error' : undefined}
                            {...register('email')}
                          />
                          {errors.email && (
                            <p id="w-email-error" role="alert" className="mt-1 text-sm text-red-600">
                              {errors.email.message}
                            </p>
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
                            placeholder="+ country code"
                            className={inputClass}
                            aria-invalid={Boolean(errors.phone)}
                            aria-describedby={errors.phone ? 'w-phone-error' : undefined}
                            {...register('phone')}
                          />
                          {errors.phone && (
                            <p id="w-phone-error" role="alert" className="mt-1 text-sm text-red-600">
                              {errors.phone.message}
                            </p>
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
                            placeholder="e.g. Lagos"
                            {...register('location')}
                          />
                        </div>
                      </div>

                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm text-ink/50">Step 2 of 2</p>
                        <button
                          type="button"
                          onClick={() => setStep('details')}
                          className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink/70 transition hover:bg-ink/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
                        >
                          <ArrowLeft size={15} />
                          Back to details
                        </button>
                      </div>

                      <div>
                        <label className={labelClass} htmlFor="a-interest">
                          Which area interests you most?
                        </label>
                        <select
                          id="a-interest"
                          className={inputClass}
                          value={assessment.interestArea}
                          aria-invalid={Boolean(assessmentError('interestArea'))}
                          aria-describedby={
                            assessmentError('interestArea') ? 'a-interest-error' : undefined
                          }
                          onChange={(event) => {
                            const interestArea = event.target.value as InterestArea | ''
                            setAssessment(emptyAssessment(interestArea))
                            setAssessmentAttempted(false)
                          }}
                        >
                          <option value="">Choose an area</option>
                          {interestAreas.map((area) => (
                            <option key={area} value={area}>
                              {area}
                            </option>
                          ))}
                        </select>
                        {assessmentError('interestArea') && (
                          <p id="a-interest-error" role="alert" className="mt-1 text-sm text-red-600">
                            {assessmentError('interestArea')}
                          </p>
                        )}
                      </div>

                      {selectedTrack && (
                        <>
                          <p className="rounded-xl border border-line bg-canvas/50 px-4 py-3 text-sm leading-relaxed text-ink/70">
                            {selectedTrack.intro}
                          </p>

                          <CheckboxQuestion
                            id="a-activities"
                            label={`${selectedTrack.activityQuestion} Select up to two.`}
                            options={selectedTrack.activities}
                            selected={assessment.activityInterests}
                            error={assessmentError('activityInterests')}
                            onToggle={(option) =>
                              toggleAssessmentChoice('activityInterests', option)
                            }
                          />

                          {assessment.interestArea === 'Media' ? (
                            <div>
                              <label className={labelClass} htmlFor="a-experience-description">
                                {selectedTrack.experienceQuestion}
                              </label>
                              <p className="mt-1 text-sm text-ink/55">
                                {selectedTrack.experienceHint}
                              </p>
                              <textarea
                                id="a-experience-description"
                                className={textareaClass}
                                value={assessment.experienceDescription}
                                aria-invalid={Boolean(assessmentError('experienceDescription'))}
                                aria-describedby={
                                  assessmentError('experienceDescription')
                                    ? 'a-experience-description-error'
                                    : undefined
                                }
                                onChange={(event) =>
                                  setAssessment((current) => ({
                                    ...current,
                                    experienceDescription: event.target.value,
                                  }))
                                }
                              />
                              {assessmentError('experienceDescription') && (
                                <p
                                  id="a-experience-description-error"
                                  role="alert"
                                  className="mt-1 text-sm text-red-600"
                                >
                                  {assessmentError('experienceDescription')}
                                </p>
                              )}
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div>
                                <label className={labelClass} htmlFor="a-previous-experience">
                                  {selectedTrack.experienceQuestion}
                                </label>
                                <select
                                  id="a-previous-experience"
                                  className={inputClass}
                                  value={assessment.previousExperience}
                                  aria-invalid={Boolean(assessmentError('previousExperience'))}
                                  aria-describedby={
                                    assessmentError('previousExperience')
                                      ? 'a-previous-experience-error'
                                      : undefined
                                  }
                                  onChange={(event) =>
                                    setAssessment((current) => ({
                                      ...current,
                                      previousExperience: event.target.value as
                                        | 'Yes'
                                        | 'No'
                                        | '',
                                      experienceDescription:
                                        event.target.value === 'Yes'
                                          ? current.experienceDescription
                                          : '',
                                    }))
                                  }
                                >
                                  <option value="">Choose one</option>
                                  <option value="Yes">Yes</option>
                                  <option value="No">No</option>
                                </select>
                                {assessmentError('previousExperience') && (
                                  <p
                                    id="a-previous-experience-error"
                                    role="alert"
                                    className="mt-1 text-sm text-red-600"
                                  >
                                    {assessmentError('previousExperience')}
                                  </p>
                                )}
                              </div>
                              {assessment.previousExperience === 'Yes' && (
                                <div>
                                  <label className={labelClass} htmlFor="a-experience-description">
                                    If yes, briefly describe what you did.
                                  </label>
                                  <p className="mt-1 text-sm text-ink/55">
                                    {selectedTrack.experienceHint}
                                  </p>
                                  <textarea
                                    id="a-experience-description"
                                    className={textareaClass}
                                    value={assessment.experienceDescription}
                                    aria-invalid={Boolean(
                                      assessmentError('experienceDescription'),
                                    )}
                                    aria-describedby={
                                      assessmentError('experienceDescription')
                                        ? 'a-experience-description-error'
                                        : undefined
                                    }
                                    onChange={(event) =>
                                      setAssessment((current) => ({
                                        ...current,
                                        experienceDescription: event.target.value,
                                      }))
                                    }
                                  />
                                  {assessmentError('experienceDescription') && (
                                    <p
                                      id="a-experience-description-error"
                                      role="alert"
                                      className="mt-1 text-sm text-red-600"
                                    >
                                      {assessmentError('experienceDescription')}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          <div>
                            <label className={labelClass} htmlFor="a-scenario-response">
                              {selectedTrack.scenarioQuestion}
                            </label>
                            <p className="mt-1 text-sm text-ink/55">Write 2–3 sentences.</p>
                            <textarea
                              id="a-scenario-response"
                              className={textareaClass}
                              value={assessment.scenarioResponse}
                              aria-invalid={Boolean(assessmentError('scenarioResponse'))}
                              aria-describedby={
                                assessmentError('scenarioResponse')
                                  ? 'a-scenario-response-error'
                                  : undefined
                              }
                              onChange={(event) =>
                                setAssessment((current) => ({
                                  ...current,
                                  scenarioResponse: event.target.value,
                                }))
                              }
                            />
                            {assessmentError('scenarioResponse') && (
                              <p
                                id="a-scenario-response-error"
                                role="alert"
                                className="mt-1 text-sm text-red-600"
                              >
                                {assessmentError('scenarioResponse')}
                              </p>
                            )}
                          </div>

                          <CheckboxQuestion
                            id="a-tools"
                            label={`${selectedTrack.toolsQuestion} Select all that apply.`}
                            options={selectedTrack.tools}
                            selected={assessment.toolsUsed}
                            error={assessmentError('toolsUsed')}
                            onToggle={(option) => toggleAssessmentChoice('toolsUsed', option)}
                          />

                          {assessment.toolsUsed.includes('Other') && (
                            <div>
                              <label className={labelClass} htmlFor="a-other-tool">
                                Which other tool have you used?
                              </label>
                              <input
                                id="a-other-tool"
                                className={inputClass}
                                value={assessment.otherTool}
                                aria-invalid={Boolean(assessmentError('otherTool'))}
                                aria-describedby={
                                  assessmentError('otherTool') ? 'a-other-tool-error' : undefined
                                }
                                onChange={(event) =>
                                  setAssessment((current) => ({
                                    ...current,
                                    otherTool: event.target.value,
                                  }))
                                }
                              />
                              {assessmentError('otherTool') && (
                                <p
                                  id="a-other-tool-error"
                                  role="alert"
                                  className="mt-1 text-sm text-red-600"
                                >
                                  {assessmentError('otherTool')}
                                </p>
                              )}
                            </div>
                          )}

                          <div>
                            <label className={labelClass} htmlFor="a-support-needed">
                              {selectedTrack.supportQuestion}
                            </label>
                            <select
                              id="a-support-needed"
                              className={inputClass}
                              value={assessment.supportNeeded}
                              aria-invalid={Boolean(assessmentError('supportNeeded'))}
                              aria-describedby={
                                assessmentError('supportNeeded')
                                  ? 'a-support-needed-error'
                                  : undefined
                              }
                              onChange={(event) =>
                                setAssessment((current) => ({
                                  ...current,
                                  supportNeeded: event.target.value,
                                }))
                              }
                            >
                              <option value="">Choose one</option>
                              {supportOptions.map((option) => (
                                <option key={option} value={option}>
                                  {option}
                                </option>
                              ))}
                            </select>
                            {assessmentError('supportNeeded') && (
                              <p
                                id="a-support-needed-error"
                                role="alert"
                                className="mt-1 text-sm text-red-600"
                              >
                                {assessmentError('supportNeeded')}
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {serverError && (
                    <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                      {serverError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full bg-ink px-6 py-3.5 font-medium text-canvas transition hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting
                      ? 'Saving your application…'
                      : step === 'details'
                        ? 'Proceed to assessment'
                        : 'Submit assessment'}
                  </button>

                  <p className="text-center text-xs text-ink/50">
                    We’ll use your details and assessment answers to contact you about
                    Future of Work and discuss skills and opportunities.
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
