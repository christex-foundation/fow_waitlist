import Logo from './Logo'

const navLinks = [
  { label: 'How it works', href: '#how' },
  { label: 'Skills', href: '#skills' },
  { label: 'Why us', href: '#why' },
  { label: 'Waitlist', href: '#waitlist' },
]

export default function Footer() {
  return (
    <footer className="bg-ink text-canvas">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-14">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <Logo tone="light" />

          <nav className="flex flex-wrap items-center gap-6" aria-label="Footer">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-canvas/70 transition-colors hover:text-canvas"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-canvas/10 pt-6 text-xs text-canvas/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Future of Work. Built in Africa.</p>
          <p>Connecting African talent with the world.</p>
        </div>
      </div>
    </footer>
  )
}
