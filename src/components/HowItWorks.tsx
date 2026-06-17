const FREELANCER = [
  'Create a profile and show your skills',
  'Browse jobs or get matched to clients',
  'Deliver great work and get paid',
]

const CLIENT = [
  'Post what you need done',
  'Compare verified freelancers and reviews',
  'Hire, collaborate, and pay securely',
]

function Track({ title, steps }: { title: string; steps: string[] }) {
  return (
    <div className="rounded-xl border border-fow-ink/10 bg-white p-6">
      <h3 className="text-lg font-semibold text-fow-ink">{title}</h3>
      <ol className="mt-4 space-y-4">
        {steps.map((step, i) => (
          <li key={step} className="flex gap-3">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-fow-green/10 text-sm font-bold text-fow-green-dark">
              {i + 1}
            </span>
            <span className="text-fow-muted">{step}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}

export default function HowItWorks() {
  return (
    <section id="how" className="bg-fow-sand">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <h2 className="text-center text-2xl font-bold tracking-tight text-fow-ink sm:text-3xl">
          How it works
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <Track title="For freelancers" steps={FREELANCER} />
          <Track title="For clients" steps={CLIENT} />
        </div>
      </div>
    </section>
  )
}
