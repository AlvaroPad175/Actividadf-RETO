'use client'

import { useRouter } from 'next/navigation'
import { matches } from '@/data/matches'
import GameCard from '@/components/GameCard'
import { Match } from '@/types'

const TIPS = [
  'Escribe el nombre o apellido del jugador — ambos son válidos.',
  'Los acentos son opcionales: "Malagón" o "Malagon" funcionan igual.',
  'Alterna entre local y visitante con las pestañas del juego.',
  'Usa "Revelar respuestas" si te rindes. Los no adivinados aparecerán en rojo.',
]

export default function GuessXIPage() {
  const router = useRouter()

  const handleMatchClick = (match: Match) => {
    router.push(`/games/guess-xi/${match.id}`)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-10 animate-fade-up">
          <div
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-4 text-xs font-semibold"
            style={{
              background: 'rgba(255,215,0,0.08)',
              border: '1px solid rgba(255,215,0,0.22)',
              color: '#FFD700',
            }}
          >
            Adivina el XI
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight mb-2">
            Elige un partido
          </h1>
          <p className="text-base" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Selecciona un clásico y adivina el XI titular de cada equipo.
          </p>
        </div>

        {/* Match grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {matches.map((match) => (
            <GameCard key={match.id} match={match} onClick={handleMatchClick} />
          ))}
        </div>

        {/* Tips */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: 'rgba(13,18,32,0.7)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <h3 className="text-white font-bold text-sm mb-4">Consejos</h3>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {TIPS.map((tip, i) => (
              <li key={i} className="flex gap-2.5 items-start">
                <span className="mt-0.5 text-xs font-bold shrink-0" style={{ color: '#FFD700' }}>→</span>
                <span className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {tip}
                </span>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}
