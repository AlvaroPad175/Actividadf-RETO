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
  const pct = total > 0 ? Math.round((progress / total) * 100) : 0
  const done = progress === total && total > 0

  return (
    <div
      className="w-full"
      style={{
        background: 'rgba(6,10,18,0.95)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <Link
          href="/games/guess-xi"
          className="flex items-center gap-1.5 text-xs font-medium transition-colors"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          <span>←</span>
          <span>Partidos</span>
        </Link>

        {/* Match title */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-black tracking-tight">
            <span style={{ color: homeTeam.color }}>{homeTeam.shortName}</span>
            <span
              className="text-xs font-normal px-2 py-0.5 rounded-md"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.4)',
              }}
            >
              {score ? `${score.home}–${score.away}` : 'vs'}
            </span>
            <span style={{ color: awayTeam.color }}>{awayTeam.shortName}</span>
          </div>
          <p className="text-[9px] mt-0.5" style={{ color: 'rgba(255,255,255,0.22)' }}>
            {match.stage}
          </p>
        </div>

        {/* Progress counter */}
        <div
          className="text-xs font-black px-2.5 py-1 rounded-full tabular-nums"
          style={{
            background: done ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.05)',
            color: done ? '#4ade80' : 'rgba(255,255,255,0.5)',
            border: done ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.08)',
            transition: 'all 0.3s',
          }}
        >
          {progress}/{total}
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-4 mb-2.5">
        <div
          className="h-1 rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${pct}%`,
              background: done
                ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                : `linear-gradient(90deg, ${
                    selectedTeam === 'home' ? homeTeam.color : awayTeam.color
                  }aa, ${
                    selectedTeam === 'home' ? homeTeam.color : awayTeam.color
                  })`,
            }}
          />
        </div>
      </div>

      {/* Team selector tabs */}
      <div className="flex px-4 pb-3 gap-2">
        {(['home', 'away'] as const).map((side) => {
          const team = side === 'home' ? homeTeam : awayTeam
          const active = selectedTeam === side
          return (
            <button
              key={side}
              onClick={() => onSelectTeam(side)}
              className="flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200"
              style={
                active
                  ? {
                      background: `${team.color}15`,
                      border: `1.5px solid ${team.color}55`,
                      color: team.color,
                      boxShadow: `0 0 16px ${team.color}18`,
                    }
                  : {
                      background: 'rgba(255,255,255,0.03)',
                      border: '1.5px solid rgba(255,255,255,0.06)',
                      color: 'rgba(255,255,255,0.3)',
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
