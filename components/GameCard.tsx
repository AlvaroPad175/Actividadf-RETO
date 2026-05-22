'use client'

import { Match } from '@/types'

interface GameCardProps {
  match: Match
  onClick: (match: Match) => void
}

export default function GameCard({ match, onClick }: GameCardProps) {
  const formattedDate = new Date(match.date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div
      onClick={() => onClick(match)}
      className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-yellow-400/60 hover:bg-gray-750 transition-all cursor-pointer group"
    >
      {/* Competition badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-md">
          {match.competition}
        </span>
        <span className="text-xs text-gray-400">{match.stage}</span>
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between gap-3 mb-4">
        {/* Home team */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center font-black text-lg border-2"
            style={{
              backgroundColor: match.homeTeam.color + '20',
              borderColor: match.homeTeam.color,
              color: match.homeTeam.color,
            }}
          >
            {match.homeTeam.shortName}
          </div>
          <span className="text-white font-semibold text-sm text-center leading-tight">
            {match.homeTeam.name}
          </span>
        </div>

        {/* Score / VS */}
        <div className="flex flex-col items-center">
          {match.score ? (
            <div className="text-center">
              <span className="text-white font-black text-2xl">
                {match.score.home} - {match.score.away}
              </span>
            </div>
          ) : (
            <span className="text-gray-400 font-bold text-xl">VS</span>
          )}
          <span className="text-gray-500 text-xs mt-1">{formattedDate}</span>
        </div>

        {/* Away team */}
        <div className="flex flex-col items-center gap-2 flex-1">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center font-black text-lg border-2"
            style={{
              backgroundColor: match.awayTeam.color + '20',
              borderColor: match.awayTeam.color,
              color: match.awayTeam.color,
            }}
          >
            {match.awayTeam.shortName}
          </div>
          <span className="text-white font-semibold text-sm text-center leading-tight">
            {match.awayTeam.name}
          </span>
        </div>
      </div>

      {/* Play button */}
      <button className="w-full mt-2 bg-yellow-400 text-gray-900 py-2.5 rounded-lg font-bold text-sm group-hover:bg-yellow-300 transition-colors">
        Jugar →
      </button>
    </div>
  )
}
