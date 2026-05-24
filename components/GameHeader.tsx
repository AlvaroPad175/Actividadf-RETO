'use client'

import Link from 'next/link'
import { Match } from '@/types'

interface GameHeaderProps {
  match: Match
  selectedTeam: 'home' | 'away'
  onSelectTeam: (team: 'home' | 'away') => void
  progress: number
  total: number
}

export default function GameHeader({
  match,
  selectedTeam,
  onSelectTeam,
  progress,
  total,
}: GameHeaderProps) {
  const homeTeam = match.homeTeam
  const awayTeam = match.awayTeam
  const score = match.score

  return (
    <div
      className="w-full"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Top row: back + match title + progress */}
      <div className="flex items-center justify-between px-4 py-3">
        <Link
          href="/games/guess-xi"
          className="text-white/30 hover:text-white/60 transition-colors text-sm flex items-center gap-1.5"
        >
          <span>←</span>
        </Link>

        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-black tracking-tight">
            <span style={{ color: homeTeam.color }}>{homeTeam.shortName}</span>
            <span className="text-white/30 text-xs font-normal">
              {score ? `${score.home}–${score.away}` : 'vs'}
            </span>
            <span style={{ color: awayTeam.color }}>{awayTeam.shortName}</span>
          </div>
          <p className="text-[10px] text-white/25 mt-0.5">{match.stage}</p>
        </div>

        {/* Progress pill */}
        <div
          className="text-xs font-black px-2.5 py-1 rounded-full"
          style={{
            background: progress === total && total > 0
              ? 'rgba(34,197,94,0.15)'
              : 'rgba(255,255,255,0.06)',
            color: progress === total && total > 0 ? '#22c55e' : 'rgba(255,255,255,0.5)',
            border: progress === total && total > 0
              ? '1px solid rgba(34,197,94,0.3)'
              : '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {progress}/{total}
        </div>
      </div>

      {/* Team selector */}
      <div className="flex px-4 pb-3 gap-2">
        {(['home', 'away'] as const).map((side) => {
          const team = side === 'home' ? homeTeam : awayTeam
          const active = selectedTeam === side
          return (
            <button
              key={side}
              onClick={() => onSelectTeam(side)}
              className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
              style={
                active
                  ? {
                      background: `${team.color}18`,
                      border: `1.5px solid ${team.color}60`,
                      color: team.color,
                      boxShadow: `0 0 12px ${team.color}20`,
                    }
                  : {
                      background: 'rgba(255,255,255,0.03)',
                      border: '1.5px solid rgba(255,255,255,0.07)',
                      color: 'rgba(255,255,255,0.35)',
                    }
              }
            >
              {team.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
