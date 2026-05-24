'use client'

import { useRouter } from 'next/navigation'
import { matches } from '@/data/matches'
import GameCard from '@/components/GameCard'
import { Match } from '@/types'

export default function GuessXIPage() {
  const router = useRouter()

  const handleMatchClick = (match: Match) => {
    router.push(`/games/guess-xi/${match.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-3 py-1 mb-4">
            <span className="text-yellow-400 text-xs font-semibold">Adivina el XI</span>
          </div>
          <h1 className="text-4xl font-black text-white mb-2">
            Elige un partido
          </h1>
          <p className="text-gray-400 text-lg">
            Selecciona uno de los clásicos para adivinar el XI titular de cada equipo.
          </p>
        </div>

        {/* Match grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match) => (
            <GameCard key={match.id} match={match} onClick={handleMatchClick} />
          ))}
        </div>

        {/* Help text */}
        <div className="mt-12 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
          <h3 className="text-white font-bold mb-3">Cómo funciona</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex gap-2">
              <span className="text-yellow-400 shrink-0">→</span>
              Escribe el nombre del jugador en el campo de texto correspondiente.
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-400 shrink-0">→</span>
              Puedes escribir sin acentos (ej: &quot;Malagón&quot; o &quot;Malagon&quot; son válidos).
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-400 shrink-0">→</span>
              Alterna entre el equipo local y visitante con las pestañas de selección.
            </li>
            <li className="flex gap-2">
              <span className="text-yellow-400 shrink-0">→</span>
              Usa &quot;Revelar todo&quot; si te rindes, pero los jugadores no adivinados se marcarán en rojo.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
