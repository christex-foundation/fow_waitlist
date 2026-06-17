export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-white to-fow-sand">
      <div className="mx-auto max-w-5xl px-5 pt-16 pb-12 text-center sm:pt-24 sm:pb-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-fow-green/30 bg-fow-green/10 px-3 py-1 text-sm font-medium text-fow-green-dark">
          🇸🇱 Salone-first
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-fow-ink sm:text-5xl">
          Work that works for{' '}
          <span className="text-fow-green">Sierra Leone</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-lg text-fow-muted">
          Future of Work connects Sierra Leonean freelancers with clients at home
          and abroad. Find skilled people, get paid fairly, and build your career —
          all from your phone.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#waitlist"
            className="w-full rounded-lg bg-fow-green px-6 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-fow-green-dark sm:w-auto"
          >
            Join the waitlist
          </a>
          <a
            href="#how"
            className="w-full rounded-lg border border-fow-ink/15 bg-white px-6 py-3 text-center font-semibold text-fow-ink transition hover:border-fow-ink/30 sm:w-auto"
          >
            How it works
          </a>
        </div>
      </div>
    </section>
  )
}
