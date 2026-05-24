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

  useEffect(() => {
    if (!isComplete && !isRevealed) {
      inputRef.current?.focus()
    }
  }, [isComplete, isRevealed])

  /* ── Reveal confirm ───────────────────────────────── */
  if (showRevealConfirm) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-4">
        <div
          className="rounded-xl p-4 text-center"
          style={{
            background: 'rgba(239,68,68,0.07)',
            border: '1px solid rgba(239,68,68,0.22)',
          }}
        >
          <p className="text-sm mb-3" style={{ color: 'rgba(255,255,255,0.7)' }}>
            ¿Revelar los <strong className="text-white">{remaining.length}</strong> jugadores restantes?
          </p>
          <div className="flex gap-2">
            <button
              onClick={onRevealConfirm}
              className="flex-1 py-2 rounded-lg text-sm font-bold text-white"
              style={{ background: 'rgba(239,68,68,0.6)' }}
            >
              Sí, revelar
            </button>
            <button
              onClick={onCancelReveal}
              className="flex-1 py-2 rounded-lg text-sm font-bold"
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── Complete (all guessed) ───────────────────────── */
  if (isComplete && !isRevealed) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-4">
        <div
          className="rounded-xl p-4 text-center"
          style={{
            background: `${team.color}10`,
            border: `1px solid ${team.color}35`,
            boxShadow: `0 0 24px ${team.color}18`,
          }}
        >
          <p className="font-black text-white text-base tracking-wide">¡XI COMPLETO!</p>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
            {team.name}
          </p>
        </div>
      </div>
    )
  }

  /* ── Revealed (gave up) ───────────────────────────── */
  if (isRevealed) {
    return (
      <div className="w-full max-w-md mx-auto px-4 py-4">
        <button
          onClick={onReset}
          className="w-full py-3 rounded-xl text-sm font-bold transition-all"
          style={{
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          Reintentar este equipo
        </button>
      </div>
    )
  }

  /* ── Main input ───────────────────────────────────── */
  return (
    <div className="w-full max-w-md mx-auto px-4 py-3">
      <div
        className={`flex items-center gap-2 rounded-xl px-3 py-2 transition-all ${
          shake ? 'animate-input-shake' : ''
        }`}
        style={{
          background: wrongFlash
            ? 'rgba(239,68,68,0.1)'
            : correctFlash
            ? `${team.color}12`
            : 'rgba(255,255,255,0.04)',
          border: wrongFlash
            ? '1.5px solid rgba(239,68,68,0.45)'
            : correctFlash
            ? `1.5px solid ${team.color}70`
            : '1.5px solid rgba(255,255,255,0.08)',
          boxShadow: correctFlash ? `0 0 20px ${team.color}25` : 'none',
        }}
      >
        {/* Team badge */}
        <div
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[9px] font-black"
          style={{
            background: `${team.color}18`,
            border: `1px solid ${team.color}35`,
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
          className="flex-1 bg-transparent text-white text-sm outline-none min-w-0"
          style={{ caretColor: team.color }}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />

        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm transition-all disabled:opacity-25"
          style={{
            background: value.trim() ? team.color : 'rgba(255,255,255,0.07)',
            color: value.trim() ? '#000' : 'rgba(255,255,255,0.3)',
          }}
        >
          →
        </button>
      </div>

      {/* Reveal link */}
      <div className="text-center mt-2.5">
        <button
          onClick={onReveal}
          className="text-[11px] transition-colors"
          style={{ color: 'rgba(255,255,255,0.18)' }}
        >
          Revelar respuestas
        </button>
      </div>
    </div>
  )
}
