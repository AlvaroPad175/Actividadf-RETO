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

  // Reset reveal confirm when switching teams
  useEffect(() => {
    setShowRevealConfirm(false)
  }, [selectedTeam])

  if (!match || !currentLineup || !activeTeam) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#070b14' }}>
        <div className="text-center">
          <p className="text-white/40 text-lg mb-4">Partido no encontrado</p>
          <Link
            href="/games/guess-xi"
            className="text-sm font-bold px-5 py-2.5 rounded-xl text-black"
            style={{ background: '#FFD700' }}
          >
            Volver
          </Link>
        </div>
      </div>
    )
  }

  const progress  = guessedPlayers.size
  const total     = currentLineup.players.length
  const isComplete = progress === total
  const isRevealed = revealedPlayers.size > 0

  const homeComplete  = homeGuessed.size  === match.homeLineup.players.length
  const awayComplete  = awayGuessed.size  === match.awayLineup.players.length
  const homeResolved  = homeComplete  || homeRevealed.size  > 0
  const awayResolved  = awayComplete  || awayRevealed.size  > 0
  const bothDone      = homeResolved  && awayResolved

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#070b14' }}
    >
      {/* Top bar */}
      <GameHeader
        match={match}
        selectedTeam={selectedTeam}
        onSelectTeam={setSelectedTeam}
        progress={progress}
        total={total}
      />

      {/* Pitch area — grows to fill available space */}
      <div className="flex-1 flex items-center justify-center px-4 py-4 overflow-hidden">
        <PitchView
          lineup={currentLineup}
          guessedPlayers={guessedPlayers}
          revealedPlayers={revealedPlayers}
          lastGuessedId={lastGuessedId}
          teamColor={activeTeam.color}
        />
      </div>

      {/* Both teams done banner */}
      {bothDone && (
        <div className="px-4 pb-2">
          <div
            className="rounded-xl p-3 text-center text-sm font-bold text-white/80"
            style={{ background: 'rgba(255,215,0,0.08)', border: '1px solid rgba(255,215,0,0.2)' }}
          >
            Partido completado —{' '}
            <Link href="/games/guess-xi" className="text-yellow-400 underline underline-offset-2">
              jugar otro
            </Link>
          </div>
        </div>
      )}

      {/* Switch team prompt when one is done */}
      {isComplete && !isRevealed && !bothDone && (
        <div className="px-4 pb-2">
          <button
            onClick={() => setSelectedTeam(selectedTeam === 'home' ? 'away' : 'home')}
            className="w-full rounded-xl py-2.5 text-xs font-bold text-white/50 border border-white/08 hover:border-white/15 hover:text-white/70 transition-colors"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
          >
            Adivinar el otro equipo →
          </button>
        </div>
      )}

      {/* Bottom input */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: '#050709' }}>
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
