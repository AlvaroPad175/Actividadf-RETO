'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Player } from '@/types'
import { checkAnswer } from '@/lib/utils'

interface PlayerInputProps {
  player: Player
  onCorrectGuess: (playerId: string) => void
  revealed: boolean
  isGuessed: boolean
}

const positionColors: Record<string, string> = {
  GK: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  DEF: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  MID: 'bg-green-500/20 text-green-400 border-green-500/40',
  FWD: 'bg-red-500/20 text-red-400 border-red-500/40',
}

export default function PlayerInput({
  player,
  onCorrectGuess,
  revealed,
  isGuessed,
}: PlayerInputProps) {
  const [value, setValue] = useState('')
  const [shake, setShake] = useState(false)
  const [wrongFlash, setWrongFlash] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const isDone = isGuessed || revealed

  const handleSubmit = useCallback(() => {
    if (!value.trim() || isDone) return

    if (checkAnswer(value, player.name)) {
      onCorrectGuess(player.id)
      setValue('')
    } else {
      // Wrong answer - shake and flash red
      setShake(true)
      setWrongFlash(true)
      setTimeout(() => setShake(false), 400)
      setTimeout(() => setWrongFlash(false), 600)
      setValue('')
      inputRef.current?.focus()
    }
  }, [value, isDone, player.name, player.id, onCorrectGuess])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSubmit()
      }
    },
    [handleSubmit]
  )

  useEffect(() => {
    if (isGuessed) {
      setValue('')
    }
  }, [isGuessed])

  return (
    <div
      className={`rounded-lg border p-3 transition-all ${
        shake ? 'animate-shake' : ''
      } ${
        isGuessed
          ? 'bg-green-900/30 border-green-600/50'
          : revealed
          ? 'bg-red-900/20 border-red-700/40'
          : wrongFlash
          ? 'bg-red-900/30 border-red-500'
          : 'bg-gray-800 border-gray-700'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`text-xs font-bold px-1.5 py-0.5 rounded border ${
            positionColors[player.position]
          }`}
        >
          {player.position}
        </span>
        <span className="text-gray-400 text-xs font-mono">#{player.number}</span>
      </div>

      {isDone ? (
        <div
          className={`font-bold text-sm ${
            isGuessed ? 'text-green-400' : 'text-red-400/80'
          }`}
        >
          {player.name}
          {isGuessed && (
            <span className="ml-2 text-green-500 text-xs">✓</span>
          )}
        </div>
      ) : (
        <div className="flex gap-1">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nombre del jugador..."
            className={`flex-1 bg-gray-700 border rounded px-2 py-1.5 text-sm text-white placeholder-gray-500 outline-none focus:border-yellow-400/60 transition-colors min-w-0 ${
              wrongFlash ? 'border-red-500' : 'border-gray-600'
            }`}
          />
          <button
            onClick={handleSubmit}
            className="bg-yellow-400 text-gray-900 px-2.5 py-1.5 rounded text-xs font-bold hover:bg-yellow-300 transition-colors shrink-0"
          >
            OK
          </button>
        </div>
      )}
    </div>
  )
}
