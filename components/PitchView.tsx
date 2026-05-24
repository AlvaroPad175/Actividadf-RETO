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

  if (fwd.length > 0) rows.push(fwd)

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

  if (def.length > 0) rows.push(def)
  if (gk.length > 0) rows.push(gk)

  return rows
}

function PitchMarkings({ teamColor }: { teamColor: string }) {
  const line = 'rgba(255,255,255,0.065)'
  const faint = 'rgba(255,255,255,0.04)'
  return (
    <svg
      viewBox="0 0 300 430"
      className="absolute inset-0 w-full h-full pointer-events-none"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="pitchGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={teamColor} stopOpacity="0.04" />
          <stop offset="50%"  stopColor="transparent" stopOpacity="0" />
          <stop offset="100%" stopColor={teamColor} stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Subtle color wash from team color */}
      <rect x="0" y="0" width="300" height="430" fill="url(#pitchGrad)" />

      {/* Outer border */}
      <rect x="2" y="2" width="296" height="426" fill="none" stroke={line} strokeWidth="1.5" rx="6" />

      {/* Center line */}
      <line x1="12" y1="215" x2="288" y2="215" stroke={line} strokeWidth="1.2" />

      {/* Center circle */}
      <circle cx="150" cy="215" r="46" fill="none" stroke={line} strokeWidth="1.2" />
      <circle cx="150" cy="215" r="2.5" fill={line} />

      {/* Penalty areas */}
      <rect x="80" y="2" width="140" height="64" fill="none" stroke={line} strokeWidth="1.2" />
      <rect x="110" y="2" width="80" height="28" fill="none" stroke={faint} strokeWidth="1" />
      <path d="M 98 66 A 44 44 0 0 1 202 66" fill="none" stroke={line} strokeWidth="1.2" />
      <circle cx="150" cy="46" r="2" fill={faint} />

      <rect x="80" y="364" width="140" height="64" fill="none" stroke={line} strokeWidth="1.2" />
      <rect x="110" y="400" width="80" height="28" fill="none" stroke={faint} strokeWidth="1" />
      <path d="M 98 364 A 44 44 0 0 0 202 364" fill="none" stroke={line} strokeWidth="1.2" />
      <circle cx="150" cy="384" r="2" fill={faint} />

      {/* Corner arcs */}
      <path d="M 12 18 A 12 12 0 0 1 24 6" fill="none" stroke={faint} strokeWidth="1" />
      <path d="M 288 6 A 12 12 0 0 1 276 18" fill="none" stroke={faint} strokeWidth="1" />
      <path d="M 12 412 A 12 12 0 0 0 24 424" fill="none" stroke={faint} strokeWidth="1" />
      <path d="M 276 424 A 12 12 0 0 0 288 412" fill="none" stroke={faint} strokeWidth="1" />
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
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #09111f 0%, #0b1526 40%, #0d1830 60%, #09111f 100%)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.05), 0 0 40px ${teamColor}10`,
        aspectRatio: '3/4.3',
        maxWidth: '420px',
        maxHeight: '72vh',
      }}
    >
      <PitchMarkings teamColor={teamColor} />

      {/* Formation label */}
      <div
        className="absolute top-2 left-1/2 -translate-x-1/2 z-20 text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full"
        style={{
          color: `${teamColor}90`,
          background: `${teamColor}10`,
          border: `1px solid ${teamColor}20`,
        }}
      >
        {lineup.formation}
      </div>

      {/* Player rows */}
      <div className="absolute inset-0 flex flex-col justify-around py-7 px-2 z-10">
        {rows.map((row, ri) => (
          <div
            key={ri}
            className="flex items-center justify-center"
            style={{ gap: row.length >= 5 ? '3px' : row.length >= 4 ? '5px' : '8px' }}
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
