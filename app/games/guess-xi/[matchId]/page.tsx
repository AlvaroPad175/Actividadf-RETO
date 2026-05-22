'use client'

import { useState, useCallback, useMemo } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { getMatchById } from '@/data/matches'
import GameHeader from '@/components/GameHeader'
import LineupGrid from '@/components/LineupGrid'

export default function GamePage() {
  const router = useRouter()
  const params = useParams()
  const matchId = params.matchId as string

  const match = getMatchById(matchId)

  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home')
  const [homeGuessed, setHomeGuessed] = useState<Set<string>>(new Set())
  const [awayGuessed, setAwayGuessed] = useState<Set<string>>(new Set())
  const [homeRevealed, setHomeRevealed] = useState<Set<string>>(new Set())
  const [awayRevealed, setAwayRevealed] = useState<Set<string>>(new Set())
  const [showRevealConfirm, setShowRevealConfirm] = useState(false)

  const guessedPlayers = selectedTeam === 'home' ? homeGuessed : awayGuessed
  const revealedPlayers = selectedTeam === 'home' ? homeRevealed : awayRevealed

  const currentLineup = useMemo(
    () => (selectedTeam === 'home' ? match?.homeLineup : match?.awayLineup),
    [match, selectedTeam]
  )

  const handleCorrectGuess = useCallback(
    (playerId: string) => {
      if (selectedTeam === 'home') {
        setHomeGuessed((prev) => new Set(Array.from(prev).concat(playerId)))
      } else {
        setAwayGuessed((prev) => new Set(Array.from(prev).concat(playerId)))
      }
    },
    [selectedTeam]
  )

  const handleRevealAll = useCallback(() => {
    if (!currentLineup || !match) return
    const allIds = currentLineup.players.map((p) => p.id)
    const currentGuessed = selectedTeam === 'home' ? homeGuessed : awayGuessed
    const toReveal = allIds.filter((id) => !currentGuessed.has(id))

    if (selectedTeam === 'home') {
      setHomeRevealed(new Set(toReveal))
    } else {
      setAwayRevealed(new Set(toReveal))
    }
    setShowRevealConfirm(false)
  }, [currentLineup, match, selectedTeam, homeGuessed, awayGuessed])

  const handleReset = useCallback(() => {
    if (selectedTeam === 'home') {
      setHomeGuessed(new Set())
      setHomeRevealed(new Set())
    } else {
      setAwayGuessed(new Set())
      setAwayRevealed(new Set())
    }
  }, [selectedTeam])

  if (!match || !currentLineup) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-xl mb-4">Partido no encontrado</p>
          <Link
            href="/games/guess-xi"
            className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition-colors"
          >
            Volver a partidos
          </Link>
        </div>
      </div>
    )
  }

  const progress = guessedPlayers.size
  const total = currentLineup.players.length
  const revealed = revealedPlayers.size > 0
  const isComplete = progress === total

  const homeComplete = homeGuessed.size === match.homeLineup.players.length
  const awayComplete = awayGuessed.size === match.awayLineup.players.length
  const bothTeamsDone =
    (homeComplete || homeRevealed.size > 0) && (awayComplete || awayRevealed.size > 0)

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/games" className="hover:text-yellow-400 transition-colors">
            Juegos
          </Link>
          <span>/</span>
          <Link href="/games/guess-xi" className="hover:text-yellow-400 transition-colors">
            Adivina el XI
          </Link>
          <span>/</span>
          <span className="text-white">{match.homeTeam.shortName} vs {match.awayTeam.shortName}</span>
        </nav>

        {/* Game header */}
        <GameHeader
          match={match}
          selectedTeam={selectedTeam}
          onSelectTeam={(team) => setSelectedTeam(team)}
          progress={progress}
          total={total}
        />

        {/* Win state */}
        {isComplete && !revealed && (
          <div className="bg-green-900/40 border border-green-600/50 rounded-xl p-5 mb-6 text-center">
            <div className="text-2xl mb-2">🏆</div>
            <h2 className="text-green-400 font-black text-xl mb-1">
              ¡XI Completado!
            </h2>
            <p className="text-gray-300 text-sm">
              Adivinaste los 11 jugadores de {selectedTeam === 'home' ? match.homeTeam.name : match.awayTeam.name}
            </p>
            {!bothTeamsDone && (
              <button
                onClick={() => setSelectedTeam(selectedTeam === 'home' ? 'away' : 'home')}
                className="mt-3 bg-yellow-400 text-gray-900 px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-yellow-300 transition-colors"
              >
                Adivinar el otro equipo →
              </button>
            )}
          </div>
        )}

        {/* Revealed state */}
        {revealed && !isComplete && (
          <div className="bg-red-900/30 border border-red-700/40 rounded-xl p-4 mb-6">
            <p className="text-red-400 font-semibold text-sm">
              Revelados {revealedPlayers.size} jugadores — los que no adivinaste aparecen en rojo.
            </p>
          </div>
        )}

        {/* Both teams done celebration */}
        {bothTeamsDone && (
          <div className="bg-yellow-400/10 border border-yellow-400/40 rounded-xl p-5 mb-6 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <h2 className="text-yellow-400 font-black text-xl mb-1">
              ¡Juego completado!
            </h2>
            <p className="text-gray-300 text-sm mb-3">
              Has completado el XI de ambos equipos
            </p>
            <Link
              href="/games/guess-xi"
              className="inline-block bg-yellow-400 text-gray-900 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-yellow-300 transition-colors"
            >
              Jugar otro partido →
            </Link>
          </div>
        )}

        {/* Lineup grid */}
        <div className="mb-6">
          <LineupGrid
            lineup={currentLineup}
            guessedPlayers={guessedPlayers}
            revealedPlayers={revealedPlayers}
            onCorrectGuess={handleCorrectGuess}
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Reveal confirm dialog */}
          {showRevealConfirm ? (
            <div className="flex-1 bg-gray-800 border border-red-700/50 rounded-xl p-4">
              <p className="text-gray-300 text-sm mb-3">
                ¿Seguro que quieres revelar todos los jugadores? No podrás deshacer esto.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleRevealAll}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg font-bold text-sm hover:bg-red-500 transition-colors"
                >
                  Sí, revelar
                </button>
                <button
                  onClick={() => setShowRevealConfirm(false)}
                  className="flex-1 border border-gray-600 text-gray-300 py-2 rounded-lg font-bold text-sm hover:border-gray-400 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              {!isComplete && !revealed && (
                <button
                  onClick={() => setShowRevealConfirm(true)}
                  className="flex-1 border border-red-700/60 text-red-400 py-2.5 rounded-lg font-bold text-sm hover:border-red-600 hover:text-red-300 transition-colors"
                >
                  Revelar todo
                </button>
              )}
              {(isComplete || revealed) && (
                <button
                  onClick={handleReset}
                  className="flex-1 border border-gray-600 text-gray-300 py-2.5 rounded-lg font-bold text-sm hover:border-gray-400 hover:text-white transition-colors"
                >
                  Reiniciar equipo
                </button>
              )}
              <Link
                href="/games/guess-xi"
                className="flex-1 text-center border border-gray-600 text-gray-300 py-2.5 rounded-lg font-bold text-sm hover:border-gray-400 hover:text-white transition-colors"
              >
                Nuevo partido
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
