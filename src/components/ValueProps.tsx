const PROPS = [
  {
    icon: '📱',
    title: 'Built for your phone',
    body: 'Light and fast on any Android, even on a slow connection. No big downloads, no wasted data.',
  },
  {
    icon: '💸',
    title: 'Get paid fairly',
    body: 'Local payment options and clear pricing in Leones. Keep more of what you earn.',
  },
  {
    icon: '🤝',
    title: 'Trusted by community',
    body: 'Verified profiles and honest reviews so clients and freelancers can work with confidence.',
  },
  {
    icon: '🌍',
    title: 'Local and global',
    body: 'Win work from businesses in Freetown and clients around the world — from one profile.',
  },
]

export default function ValueProps() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <h2 className="text-center text-2xl font-bold tracking-tight text-fow-ink sm:text-3xl">
          Why Future of Work
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {PROPS.map((p) => (
            <div
              key={p.title}
              className="rounded-xl border border-fow-ink/10 bg-fow-sand/60 p-6"
            >
              <div className="text-3xl" aria-hidden="true">
                {p.icon}
              </div>
              <h3 className="mt-3 text-lg font-semibold text-fow-ink">{p.title}</h3>
              <p className="mt-2 text-fow-muted">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
