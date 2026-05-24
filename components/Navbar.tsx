import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-yellow-400 font-black text-xl tracking-tight">
              ⚽ Liga MX Quiz
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-300 hover:text-yellow-400 transition-colors font-medium text-sm"
            >
              Inicio
            </Link>
            <Link
              href="/games"
              className="text-gray-300 hover:text-yellow-400 transition-colors font-medium text-sm"
            >
              Juegos
            </Link>
            <Link
              href="/games/guess-xi"
              className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-300 transition-colors"
            >
              Adivina el XI
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
