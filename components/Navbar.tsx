import Link from 'next/link'

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'rgba(6,10,18,0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-base font-black"
              style={{ background: '#FFD700', color: '#000' }}
            >
              ⚽
            </div>
            <span className="text-white font-black text-base tracking-tight">
              Liga MX <span style={{ color: '#FFD700' }}>Quiz</span>
            </span>
          </Link>

          <div className="flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              Inicio
            </Link>
            <Link
              href="/games"
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{ color: 'rgba(255,255,255,0.55)' }}
            >
              Juegos
            </Link>
            <Link
              href="/games/guess-xi"
              className="ml-2 px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
              style={{
                background: '#FFD700',
                color: '#000',
              }}
            >
              Jugar →
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
