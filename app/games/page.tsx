import Link from 'next/link'
import { matches } from '@/data/matches'

const games = [
  {
    id: 'guess-xi',
    title: 'Adivina el XI',
    description: 'Adivina los 11 titulares de los clásicos más importantes de la Liga MX.',
    icon: '⚽',
    href: '/games/guess-xi',
    available: true,
    badge: `${matches.length} partidos`,
  },
  {
    id: 'top-scorer',
    title: 'Goleador Histórico',
    description: 'Adivina el goleador histórico de cada equipo de la Liga MX.',
    icon: '🥅',
    href: '#',
    available: false,
    badge: 'Próximamente',
  },
  {
    id: 'transfers',
    title: 'Fichajes',
    description: 'Adivina a qué equipo fue el jugador con base en pistas.',
    icon: '🔄',
    href: '#',
    available: false,
    badge: 'Próximamente',
  },
]

export default function GamesPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <div className="mb-10">
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">Juegos</h1>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Todos los mini-juegos de Liga MX Quiz
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {games.map((game) => (
            <div
              key={game.id}
              className="relative rounded-2xl overflow-hidden transition-all"
              style={{
                background: 'rgba(13,18,32,0.9)',
                border: '1px solid rgba(255,255,255,0.07)',
                opacity: game.available ? 1 : 0.55,
              }}
            >
              {game.available && (
                <div
                  className="absolute top-0 left-0 right-0 h-[2px]"
                  style={{ background: 'linear-gradient(90deg, #FFD700aa, #FFD70055)' }}
                />
              )}

              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{game.icon}</span>
                  <span
                    className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={
                      game.available
                        ? {
                            background: 'rgba(255,215,0,0.1)',
                            border: '1px solid rgba(255,215,0,0.25)',
                            color: '#FFD700',
                          }
                        : {
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: 'rgba(255,255,255,0.35)',
                          }
                    }
                  >
                    {game.badge}
                  </span>
                </div>

                <h2 className="text-white font-black text-xl mb-2 tracking-tight">{game.title}</h2>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  {game.description}
                </p>

                {game.available ? (
                  <Link
                    href={game.href}
                    className="block w-full text-center py-2.5 rounded-xl font-bold text-sm transition-all"
                    style={{ background: '#FFD700', color: '#000' }}
                  >
                    Jugar →
                  </Link>
                ) : (
                  <div
                    className="w-full text-center py-2.5 rounded-xl font-bold text-sm cursor-not-allowed"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.07)',
                      color: 'rgba(255,255,255,0.2)',
                    }}
                  >
                    No disponible
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
