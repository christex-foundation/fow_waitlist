export default function Footer() {
  return (
    <footer className="bg-fow-ink text-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-5 py-10 text-center">
        <p className="text-lg font-semibold">Future of Work</p>
        <p className="text-sm text-white/70">
          A Salone-first freelance marketplace. Made in Sierra Leone. 🇸🇱
        </p>
        <p className="mt-2 text-xs text-white/50">
          © {new Date().getFullYear()} Future of Work. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
