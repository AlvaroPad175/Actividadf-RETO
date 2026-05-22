import Link from 'next/link'

const games = [
  {
    id: 'guess-xi',
    title: 'Adivina el XI',
    description: 'Adivina los 11 titulares de los clásicos más importantes de la Liga MX.',
    icon: '⚽',
    href: '/games/guess-xi',
    available: true,
    matchCount: 3,
  },
  {
    id: 'top-scorer',
    title: 'Goleador Histórico',
    description: 'Adivina el goleador histórico de cada equipo de la Liga MX.',
    icon: '🥅',
    href: '#',
    available: false,
    matchCount: 0,
  },
  {
    id: 'transfers',
    title: 'Fichajes',
    description: 'Adivina a qué equipo fue el jugador con base en pistas.',
    icon: '🔄',
    href: '#',
    available: false,
    matchCount: 0,
  },
]

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-white mb-2">Juegos</h1>
          <p className="text-gray-400 text-lg">Todos los mini-juegos de Liga MX Quiz</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className={`bg-gray-800 border rounded-xl p-6 transition-all ${
                game.available
                  ? 'border-gray-700 hover:border-yellow-400/50 cursor-pointer'
                  : 'border-gray-800 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{game.icon}</span>
                {!game.available && (
                  <span className="text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded-full">
                    Próximamente
                  </span>
                )}
                {game.available && (
                  <span className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 px-2 py-1 rounded-full">
                    {game.matchCount} partidos
                  </span>
                )}
              </div>
              <h2 className="text-white font-black text-xl mb-2">{game.title}</h2>
              <p className="text-gray-400 text-sm mb-5 leading-relaxed">{game.description}</p>
              {game.available ? (
                <Link
                  href={game.href}
                  className="block w-full text-center bg-yellow-400 text-gray-900 py-2.5 rounded-lg font-bold text-sm hover:bg-yellow-300 transition-colors"
                >
                  Jugar →
                </Link>
              ) : (
                <div className="w-full text-center bg-gray-700 text-gray-500 py-2.5 rounded-lg font-bold text-sm cursor-not-allowed">
                  No disponible
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
