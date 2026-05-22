'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { matches } from '@/data/matches'
import GameCard from '@/components/GameCard'
import { Match } from '@/types'

export default function HomePage() {
  const router = useRouter()

  const handleMatchClick = (match: Match) => {
    router.push(`/games/guess-xi/${match.id}`)
  }

  const featuredMatches = matches.slice(0, 3)

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-gray-950 to-gray-900 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full px-4 py-1.5 mb-6">
              <span className="text-yellow-400 text-sm font-semibold">⚽ Temporada 2024</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-4">
              Liga MX{' '}
              <span className="text-yellow-400">Quiz</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Pon a prueba tu conocimiento del futbol mexicano. Adivina los jugadores
              de los clásicos más emocionantes de la Liga MX.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/games/guess-xi"
                className="inline-flex items-center justify-center bg-yellow-400 text-gray-900 px-8 py-4 rounded-xl font-black text-lg hover:bg-yellow-300 transition-colors"
              >
                Jugar Ahora →
              </Link>
              <Link
                href="/games"
                className="inline-flex items-center justify-center border border-gray-600 text-gray-300 px-8 py-4 rounded-xl font-semibold text-lg hover:border-gray-400 hover:text-white transition-colors"
              >
                Ver todos los juegos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-gray-800 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-black text-yellow-400">3</div>
              <div className="text-gray-400 text-sm mt-1">Clásicos disponibles</div>
            </div>
            <div>
              <div className="text-3xl font-black text-yellow-400">66</div>
              <div className="text-gray-400 text-sm mt-1">Jugadores para adivinar</div>
            </div>
            <div>
              <div className="text-3xl font-black text-yellow-400">6</div>
              <div className="text-gray-400 text-sm mt-1">Equipos incluidos</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured games */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white">Partidos Destacados</h2>
            <p className="text-gray-400 mt-1">Los clásicos más importantes de la Liga MX</p>
          </div>
          <Link
            href="/games/guess-xi"
            className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold transition-colors"
          >
            Ver todos →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredMatches.map((match) => (
            <GameCard key={match.id} match={match} onClick={handleMatchClick} />
          ))}
        </div>
      </section>

      {/* Game info section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
          <h2 className="text-xl font-black text-white mb-6">¿Cómo jugar Adivina el XI?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-yellow-400/10 border border-yellow-400/30 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-yellow-400 font-black">1</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Elige un partido</h3>
                <p className="text-gray-400 text-sm">Selecciona uno de los clásicos disponibles.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-yellow-400/10 border border-yellow-400/30 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-yellow-400 font-black">2</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Adivina los jugadores</h3>
                <p className="text-gray-400 text-sm">Escribe el nombre de cada jugador del XI titular.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-yellow-400/10 border border-yellow-400/30 rounded-lg flex items-center justify-center shrink-0">
                <span className="text-yellow-400 font-black">3</span>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Completa el XI</h3>
                <p className="text-gray-400 text-sm">Intenta adivinar los 11 jugadores antes de rendirte.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
