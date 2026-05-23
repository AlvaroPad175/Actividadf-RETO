'use client'

import { Lineup, Player } from '@/types'
import PlayerSlot from './PlayerSlot'

interface PitchViewProps {
  lineup: Lineup
  guessedPlayers: Set<string>
  revealedPlayers: Set<string>
  lastGuessedId: string | null
  teamColor: string
}

function buildRows(players: Player[], formation: string): Player[][] {
  const nums = formation.split('-').map(Number)
  const gk  = players.filter((p) => p.position === 'GK')
  const def = players.filter((p) => p.position === 'DEF')
  const mid = players.filter((p) => p.position === 'MID')
  const fwd = players.filter((p) => p.position === 'FWD')

  const rows: Player[][] = []

  // FWD row
  if (fwd.length > 0) rows.push(fwd)

  // MID rows — split by middle formation numbers
  const midNums = nums.slice(1, -1)
  if (midNums.length > 0) {
    let idx = 0
    for (const count of midNums) {
      const slice = mid.slice(idx, idx + count)
      if (slice.length > 0) rows.push(slice)
      idx += count
    }
  } else if (mid.length > 0) {
    rows.push(mid)
  }

  // DEF row
  if (def.length > 0) rows.push(def)

  // GK row
  if (gk.length > 0) rows.push(gk)

  return rows
}

// SVG football pitch markings — very subtle, drawn over the pitch background
function PitchMarkings() {
  return (
    <svg
      viewBox="0 0 300 430"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
    >
      {/* Outer border */}
      <rect
        x="1" y="1" width="298" height="428"
        fill="none"
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="1.5"
        rx="4"
      />
      {/* Center line */}
      <line
        x1="10" y1="215" x2="290" y2="215"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1.2"
      />
      {/* Center circle */}
      <circle
        cx="150" cy="215" r="44"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1.2"
      />
      {/* Center spot */}
      <circle cx="150" cy="215" r="2.5" fill="rgba(255,255,255,0.08)" />

      {/* Penalty area top */}
      <rect
        x="78" y="1" width="144" height="60"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1.2"
      />
      {/* Goal area top */}
      <rect
        x="108" y="1" width="84" height="26"
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="1"
      />
      {/* Penalty arc top */}
      <path
        d="M 95 61 A 44 44 0 0 1 205 61"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1.2"
      />
      {/* Penalty spot top */}
      <circle cx="150" cy="44" r="2" fill="rgba(255,255,255,0.07)" />

      {/* Penalty area bottom */}
      <rect
        x="78" y="369" width="144" height="60"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1.2"
      />
      {/* Goal area bottom */}
      <rect
        x="108" y="403" width="84" height="26"
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="1"
      />
      {/* Penalty arc bottom */}
      <path
        d="M 95 369 A 44 44 0 0 0 205 369"
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth="1.2"
      />
      {/* Penalty spot bottom */}
      <circle cx="150" cy="386" r="2" fill="rgba(255,255,255,0.07)" />

      {/* Corner arcs */}
      <path d="M 10 14 A 10 10 0 0 1 20 4" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <path d="M 290 4 A 10 10 0 0 1 280 14" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <path d="M 10 416 A 10 10 0 0 0 20 426" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <path d="M 280 426 A 10 10 0 0 0 290 416" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
    </svg>
  )
}

export default function PitchView({
  lineup,
  guessedPlayers,
  revealedPlayers,
  lastGuessedId,
  teamColor,
}: PitchViewProps) {
  const rows = buildRows(lineup.players, lineup.formation)

  return (
    <div
      className="relative w-full rounded-xl overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #0a1120 0%, #0c1425 50%, #0a1120 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        aspectRatio: '3/4.3',
        maxWidth: '420px',
        maxHeight: '72vh',
      }}
    >
      <PitchMarkings />

      {/* Player rows — distributed evenly top to bottom */}
      <div className="absolute inset-0 flex flex-col justify-around py-5 px-3 z-10">
        {rows.map((row, ri) => (
          <div
            key={ri}
            className="flex items-center justify-center gap-1"
            style={{ gap: row.length >= 4 ? '4px' : '8px' }}
          >
            {row.map((player) => (
              <PlayerSlot
                key={player.id}
                player={player}
                isGuessed={guessedPlayers.has(player.id)}
                isRevealed={revealedPlayers.has(player.id)}
                isNew={lastGuessedId === player.id}
                teamColor={teamColor}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
