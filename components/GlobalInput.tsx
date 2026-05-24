'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { Lineup, Team } from '@/types'
import { checkAnswer } from '@/lib/utils'

interface GlobalInputProps {
  lineup: Lineup
  team: Team
  guessedPlayers: Set<string>
  onCorrectGuess: (playerId: string) => void
  isComplete: boolean
  isRevealed: boolean
  onReveal: () => void
  onReset: () => void
  onRevealConfirm: () => void
  showRevealConfirm: boolean
  onCancelReveal: () => void
}

export default function GlobalInput({
  lineup,
  team,
  guessedPlayers,
  onCorrectGuess,
  isComplete,
  isRevealed,
  onReveal,
  onReset,
  onRevealConfirm,
  showRevealConfirm,
  onCancelReveal,
}: GlobalInputProps) {
  const [value, setValue] = useState('')
  const [shake, setShake] = useState(false)
  const [wrongFlash, setWrongFlash] = useState(false)
  const [correctFlash, setCorrectFlash] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const remaining = lineup.players.filter((p) => !guessedPlayers.has(p.id))

  const handleSubmit = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || isComplete || isRevealed) return

    const match = remaining.find((p) => checkAnswer(trimmed, p.name))
    if (match) {
      onCorrectGuess(match.id)
      setValue('')
      setCorrectFlash(true)
      setTimeout(() => setCorrectFlash(false), 500)
    } else {
      setShake(true)
      setWrongFlash(true)
      setTimeout(() => setShake(false), 450)
      setTimeout(() => setWrongFlash(false), 600)
      setValue('')
      inputRef.current?.focus()
    }
  }, [value, isComplete, isRevealed, remaining, onCorrectGuess])

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleSubmit()
    },
    [handleSubmit]
  )

  // Auto-focus on mount
  useEffect(() => {
    if (!isComplete && !isRevealed) {
      inputRef.current?.focus()
    }
  }, [isComplete, isRevealed])

  if (showRevealConfirm) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <div
          className="rounded-xl p-4 text-center"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}
        >
          <p className="text-white/80 text-sm mb-3">
            ¿Revelar los {remaining.length} jugadores restantes?
          </p>
          <div className="flex gap-2">
            <button
              onClick={onRevealConfirm}
              className="flex-1 py-2 rounded-lg text-sm font-bold text-white transition-colors"
              style={{ background: 'rgba(239,68,68,0.7)' }}
            >
              Sí, revelar
            </button>
            <button
              onClick={onCancelReveal}
              className="flex-1 py-2 rounded-lg text-sm font-bold text-white/60 border border-white/10 transition-colors hover:border-white/20"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (isComplete && !isRevealed) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <div
          className="rounded-xl p-4 text-center"
          style={{
            background: `${team.color}12`,
            border: `1px solid ${team.color}40`,
            boxShadow: `0 0 24px ${team.color}20`,
          }}
        >
          <p className="font-black text-white text-base tracking-wide">¡XI COMPLETO!</p>
          <p className="text-white/50 text-xs mt-1">{team.name}</p>
        </div>
      </div>
    )
  }

  if (isRevealed) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <button
          onClick={onReset}
          className="w-full py-3 rounded-xl text-sm font-bold border border-white/10 text-white/50 hover:border-white/20 hover:text-white/70 transition-colors"
        >
          Reintentar este equipo
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 py-3">
      <div
        className={`flex items-center gap-2 rounded-xl px-3 py-2 transition-all ${
          shake ? 'animate-input-shake' : ''
        }`}
        style={{
          background: wrongFlash
            ? 'rgba(239,68,68,0.12)'
            : correctFlash
            ? `${team.color}15`
            : 'rgba(255,255,255,0.05)',
          border: wrongFlash
            ? '1.5px solid rgba(239,68,68,0.5)'
            : correctFlash
            ? `1.5px solid ${team.color}80`
            : '1.5px solid rgba(255,255,255,0.08)',
          boxShadow: correctFlash ? `0 0 20px ${team.color}30` : 'none',
        }}
      >
        {/* Team badge */}
        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black"
          style={{
            background: `${team.color}20`,
            border: `1px solid ${team.color}40`,
            color: team.color,
          }}
        >
          {team.shortName.slice(0, 3)}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Escribe el nombre del jugador..."
          disabled={isComplete || isRevealed}
          className="flex-1 bg-transparent text-white text-sm placeholder-white/25 outline-none min-w-0"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />

        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm transition-all disabled:opacity-30"
          style={{
            background: value.trim() ? team.color : 'rgba(255,255,255,0.08)',
            color: value.trim() ? '#000' : 'rgba(255,255,255,0.3)',
          }}
        >
          →
        </button>
      </div>

      {/* Reveal link */}
      <div className="text-center mt-2">
        <button
          onClick={onReveal}
          className="text-xs text-white/20 hover:text-white/40 transition-colors"
        >
          Revelar respuestas
        </button>
      </div>
    </div>
  )
}
