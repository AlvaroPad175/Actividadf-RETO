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
  if (trimmed.length <= 13) return trimmed
  const parts = trimmed.split(' ')
  // Try last name only
  const last = parts[parts.length - 1]
  if (last.length <= 13) return last
  return last.slice(0, 12) + '…'
}

export default function PlayerSlot({ player, isGuessed, isRevealed, isNew, teamColor }: PlayerSlotProps) {
  const isEmpty = !isGuessed && !isRevealed

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center gap-1">
        <div
          className="relative px-2.5 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-widest text-center transition-all select-none"
          style={{
            minWidth: '52px',
            border: `1.5px solid ${teamColor}45`,
            color: `${teamColor}70`,
            backgroundColor: `${teamColor}08`,
          }}
        >
          {player.position}
        </div>
        <span className="text-[9px] font-mono" style={{ color: 'rgba(255,255,255,0.18)' }}>
          {player.number}
        </span>
      </div>
    )
  }

  return (
    <div className={`flex flex-col items-center gap-1 ${isNew ? 'animate-slot-appear' : ''}`}>
      <div
        className="relative px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-center whitespace-nowrap transition-all select-none overflow-hidden"
        style={
          isGuessed
            ? {
                minWidth: '52px',
                maxWidth: '90px',
                border: `1.5px solid ${teamColor}`,
                color: '#ffffff',
                backgroundColor: `${teamColor}22`,
                boxShadow: `0 0 14px ${teamColor}50, 0 0 4px ${teamColor}30`,
              }
            : {
                minWidth: '52px',
                maxWidth: '90px',
                border: '1.5px solid rgba(239,68,68,0.45)',
                color: 'rgba(239,68,68,0.8)',
                backgroundColor: 'rgba(239,68,68,0.08)',
              }
        }
      >
        {displayName(player.name)}
      </div>
      <span className="text-[9px] font-mono" style={{ color: 'rgba(255,255,255,0.25)' }}>
        {player.number}
      </span>
    </div>
  )
}
