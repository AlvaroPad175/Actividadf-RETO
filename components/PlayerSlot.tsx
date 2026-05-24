'use client'

import { Player } from '@/types'

interface PlayerSlotProps {
  player: Player
  isGuessed: boolean
  isRevealed: boolean
  isNew: boolean
  teamColor: string
}

function displayName(name: string): string {
  const trimmed = name.trim()
  if (trimmed.length <= 12) return trimmed
  const parts = trimmed.split(' ')
  const last = parts[parts.length - 1]
  if (last.length <= 12) return last
  return last.slice(0, 11) + '…'
}

const POSITION_LABELS: Record<string, string> = {
  GK: 'POR',
  DEF: 'DEF',
  MID: 'MED',
  FWD: 'DEL',
}

export default function PlayerSlot({ player, isGuessed, isRevealed, isNew, teamColor }: PlayerSlotProps) {
  const isEmpty = !isGuessed && !isRevealed

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center gap-1 select-none">
        {/* Jersey silhouette */}
        <div
          className="relative rounded-lg text-[10px] font-black uppercase tracking-widest text-center transition-all"
          style={{
            minWidth: '54px',
            padding: '6px 8px',
            border: `1.5px dashed ${teamColor}35`,
            color: `${teamColor}55`,
            backgroundColor: `${teamColor}06`,
          }}
        >
          {POSITION_LABELS[player.position] ?? player.position}
        </div>
        <span
          className="text-[8px] font-mono tabular-nums"
          style={{ color: 'rgba(255,255,255,0.15)' }}
        >
          #{player.number}
        </span>
      </div>
    )
  }

  return (
    <div
      className={`flex flex-col items-center gap-1 select-none ${isNew ? 'animate-slot-appear' : ''}`}
    >
      <div
        className="relative rounded-lg text-[10px] font-bold text-center whitespace-nowrap overflow-hidden transition-all"
        style={
          isGuessed
            ? {
                minWidth: '54px',
                maxWidth: '88px',
                padding: '6px 8px',
                border: `1.5px solid ${teamColor}cc`,
                color: '#fff',
                backgroundColor: `${teamColor}20`,
                boxShadow: `0 0 12px ${teamColor}45, inset 0 1px 0 ${teamColor}30`,
              }
            : {
                minWidth: '54px',
                maxWidth: '88px',
                padding: '6px 8px',
                border: '1.5px solid rgba(239,68,68,0.4)',
                color: 'rgba(239,68,68,0.75)',
                backgroundColor: 'rgba(239,68,68,0.07)',
              }
        }
      >
        {displayName(player.name)}
      </div>
      <span
        className="text-[8px] font-mono tabular-nums"
        style={{ color: 'rgba(255,255,255,0.22)' }}
      >
        #{player.number}
      </span>
    </div>
  )
}
