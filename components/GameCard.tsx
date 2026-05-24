'use client'

import { Match } from '@/types'

interface GameCardProps {
  match: Match
  onClick: (match: Match) => void
}

export default function GameCard({ match, onClick }: GameCardProps) {
  const formattedDate = new Date(match.date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div
      onClick={() => onClick(match)}
      className="relative group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300"
      style={{
        background: 'rgba(13,18,32,0.9)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
    >
      {/* Hover gradient overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${match.homeTeam.color}08 0%, transparent 50%, ${match.awayTeam.color}08 100%)`,
        }}
      />

      {/* Top border accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
        style={{
          background: `linear-gradient(90deg, ${match.homeTeam.color}, ${match.awayTeam.color})`,
        }}
      />

      <div className="relative p-5">
        {/* Competition badge + stage */}
        <div className="flex items-center justify-between mb-5">
          <span
            className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{
              background: 'rgba(255,215,0,0.1)',
              border: '1px solid rgba(255,215,0,0.2)',
              color: '#FFD700',
            }}
          >
            {match.competition}
          </span>
          <span className="text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {formattedDate}
          </span>
        </div>

        {/* Teams row */}
        <div className="flex items-center justify-between gap-3 mb-5">
          {/* Home team */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black border"
              style={{
                backgroundColor: match.homeTeam.color + '18',
                borderColor: match.homeTeam.color + '50',
                color: match.homeTeam.color,
                boxShadow: `0 4px 16px ${match.homeTeam.color}20`,
              }}
            >
              {match.homeTeam.shortName}
            </div>
            <span className="text-white/80 font-semibold text-xs text-center leading-tight">
              {match.homeTeam.name}
            </span>
          </div>

          {/* Score */}
          <div className="flex flex-col items-center gap-1">
            {match.score ? (
              <span className="text-white font-black text-2xl tracking-tighter">
                {match.score.home}
                <span className="text-white/30 mx-1">-</span>
                {match.score.away}
              </span>
            ) : (
              <span className="font-black text-xl" style={{ color: 'rgba(255,255,255,0.2)' }}>VS</span>
            )}
            <span className="text-[9px] text-center leading-tight" style={{ color: 'rgba(255,255,255,0.25)' }}>
              {match.stage}
            </span>
          </div>

          {/* Away team */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-xs font-black border"
              style={{
                backgroundColor: match.awayTeam.color + '18',
                borderColor: match.awayTeam.color + '50',
                color: match.awayTeam.color,
                boxShadow: `0 4px 16px ${match.awayTeam.color}20`,
              }}
            >
              {match.awayTeam.shortName}
            </div>
            <span className="text-white/80 font-semibold text-xs text-center leading-tight">
              {match.awayTeam.name}
            </span>
          </div>
        </div>

        {/* CTA button */}
        <div
          className="w-full py-2.5 rounded-xl text-xs font-black text-center transition-all duration-200"
          style={{
            background: 'rgba(255,215,0,0.08)',
            border: '1px solid rgba(255,215,0,0.2)',
            color: '#FFD700',
          }}
        >
          Adivinar el XI →
        </div>
      </div>
    </div>
  )
}
