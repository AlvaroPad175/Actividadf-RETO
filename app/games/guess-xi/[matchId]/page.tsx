'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { getMatchById } from '@/data/matches'
import GameHeader from '@/components/GameHeader'
import PitchView from '@/components/PitchView'
import GlobalInput from '@/components/GlobalInput'

export default function GamePage() {
  const params = useParams()
  const matchId = params.matchId as string
  const match = getMatchById(matchId)

  const [selectedTeam, setSelectedTeam] = useState<'home' | 'away'>('home')
  const [homeGuessed, setHomeGuessed] = useState<Set<string>>(new Set())
  const [awayGuessed, setAwayGuessed] = useState<Set<string>>(new Set())
  const [homeRevealed, setHomeRevealed] = useState<Set<string>>(new Set())
  const [awayRevealed, setAwayRevealed] = useState<Set<string>>(new Set())
  const [showRevealConfirm, setShowRevealConfirm] = useState(false)
  const [lastGuessedId, setLastGuessedId] = useState<string | null>(null)

  const guessedPlayers  = selectedTeam === 'home' ? homeGuessed  : awayGuessed
  const revealedPlayers = selectedTeam === 'home' ? homeRevealed : awayRevealed

  const currentLineup = useMemo(
    () => (selectedTeam === 'home' ? match?.homeLineup : match?.awayLineup),
    [match, selectedTeam]
  )

  const activeTeam = useMemo(
    () => (selectedTeam === 'home' ? match?.homeTeam : match?.awayTeam),
    [match, selectedTeam]
  )

  const handleCorrectGuess = useCallback(
    (playerId: string) => {
      if (selectedTeam === 'home') {
        setHomeGuessed((prev) => new Set(Array.from(prev).concat(playerId)))
      } else {
        setAwayGuessed((prev) => new Set(Array.from(prev).concat(playerId)))
      }
      setLastGuessedId(playerId)
      setTimeout(() => setLastGuessedId(null), 600)
    },
    [selectedTeam]
  )

  const handleRevealAll = useCallback(() => {
    if (!currentLineup || !match) return
    const toReveal = currentLineup.players
      .map((p) => p.id)
      .filter((id) => !guessedPlayers.has(id))

    if (selectedTeam === 'home') {
      setHomeRevealed(new Set(toReveal))
    } else {
      setAwayRevealed(new Set(toReveal))
    }
    setShowRevealConfirm(false)
  }, [currentLineup, match, selectedTeam, guessedPlayers])

  const handleReset = useCallback(() => {
    if (selectedTeam === 'home') {
      setHomeGuessed(new Set())
      setHomeRevealed(new Set())
    } else {
      setAwayGuessed(new Set())
      setAwayRevealed(new Set())
    }
  }, [selectedTeam])

  useEffect(() => {
    setShowRevealConfirm(false)
  }, [selectedTeam])

  if (!match || !currentLineup || !activeTeam) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'var(--background)' }}
      >
        <div className="text-center">
          <p className="text-lg mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
            Partido no encontrado
          </p>
          <Link
            href="/games/guess-xi"
            className="text-sm font-bold px-5 py-2.5 rounded-xl"
            style={{ background: '#FFD700', color: '#000' }}
          >
            Volver
          </Link>
        </div>
      </div>
    )
  }

  const progress   = guessedPlayers.size
  const total      = currentLineup.players.length
  const isComplete = progress === total
  const isRevealed = revealedPlayers.size > 0

  const homeComplete = homeGuessed.size === match.homeLineup.players.length
  const awayComplete = awayGuessed.size === match.awayLineup.players.length
  const homeResolved = homeComplete || homeRevealed.size > 0
  const awayResolved = awayComplete || awayRevealed.size > 0
  const bothDone     = homeResolved && awayResolved

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--background)' }}
    >
      {/* Header + progress bar */}
      <GameHeader
        match={match}
        selectedTeam={selectedTeam}
        onSelectTeam={setSelectedTeam}
        progress={progress}
        total={total}
      />

      {/* Pitch — fills available space */}
      <div className="flex-1 flex items-center justify-center px-4 py-3 overflow-hidden">
        <PitchView
          lineup={currentLineup}
          guessedPlayers={guessedPlayers}
          revealedPlayers={revealedPlayers}
          lastGuessedId={lastGuessedId}
          teamColor={activeTeam.color}
        />
      </div>

      {/* Switch team prompt */}
      {isComplete && !isRevealed && !bothDone && (
        <div className="px-4 pb-2">
          <button
            onClick={() => setSelectedTeam(selectedTeam === 'home' ? 'away' : 'home')}
            className="w-full rounded-xl py-2.5 text-xs font-bold transition-all"
            style={{
              background: 'rgba(255,215,0,0.07)',
              border: '1px solid rgba(255,215,0,0.2)',
              color: '#FFD700',
            }}
          >
            Adivinar el otro equipo →
          </button>
        </div>
      )}

      {/* Both teams done banner */}
      {bothDone && (
        <div className="px-4 pb-2">
          <div
            className="rounded-xl p-3 text-center text-sm font-bold"
            style={{
              background: 'rgba(255,215,0,0.07)',
              border: '1px solid rgba(255,215,0,0.2)',
              color: '#FFD700',
            }}
          >
            ¡Partido completo! —{' '}
            <Link
              href="/games/guess-xi"
              className="underline underline-offset-2"
            >
              jugar otro
            </Link>
          </div>
        </div>
      )}

      {/* Bottom input */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          background: 'rgba(4,6,12,0.95)',
        }}
      >
        <GlobalInput
          lineup={currentLineup}
          team={activeTeam}
          guessedPlayers={guessedPlayers}
          onCorrectGuess={handleCorrectGuess}
          isComplete={isComplete}
          isRevealed={isRevealed}
          onReveal={() => setShowRevealConfirm(true)}
          onReset={handleReset}
          onRevealConfirm={handleRevealAll}
          showRevealConfirm={showRevealConfirm}
          onCancelReveal={() => setShowRevealConfirm(false)}
        />
      </div>
    </div>
  )
}
