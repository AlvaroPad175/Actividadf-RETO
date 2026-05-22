'use client'

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
  const formattedDate = new Date(match.date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const activeTeam = selectedTeam === 'home' ? match.homeTeam : match.awayTeam
  const activeLineup = selectedTeam === 'home' ? match.homeLineup : match.awayLineup
  const progressPercent = Math.round((progress / total) * 100)

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 mb-6">
      {/* Match title */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-md">
          {match.competition}
        </span>
        <span className="text-xs text-gray-400">{match.stage}</span>
      </div>

      <h1 className="text-white font-black text-xl mt-3 mb-1">
        {match.homeTeam.name}{' '}
        <span className="text-yellow-400">
          {match.score ? `${match.score.home} - ${match.score.away}` : 'vs'}
        </span>{' '}
        {match.awayTeam.name}
      </h1>
      <p className="text-gray-400 text-sm mb-4">{formattedDate}</p>

      {/* Team selector tabs */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={() => onSelectTeam('home')}
          className={`flex-1 py-2.5 rounded-lg font-bold text-sm border transition-all ${
            selectedTeam === 'home'
              ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
              : 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
          }`}
          style={
            selectedTeam === 'home'
              ? {
                  borderColor: match.homeTeam.color,
                  color: match.homeTeam.color,
                  backgroundColor: match.homeTeam.color + '15',
                }
              : {}
          }
        >
          <span className="mr-2">{match.homeTeam.shortName}</span>
          {match.homeTeam.name}
        </button>
        <button
          onClick={() => onSelectTeam('away')}
          className={`flex-1 py-2.5 rounded-lg font-bold text-sm border transition-all ${
            selectedTeam === 'away'
              ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
              : 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
          }`}
          style={
            selectedTeam === 'away'
              ? {
                  borderColor: match.awayTeam.color,
                  color: match.awayTeam.color,
                  backgroundColor: match.awayTeam.color + '15',
                }
              : {}
          }
        >
          <span className="mr-2">{match.awayTeam.shortName}</span>
          {match.awayTeam.name}
        </button>
      </div>

      {/* Formation & progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Formación:</span>
          <span
            className="font-bold text-sm px-2 py-0.5 rounded"
            style={{
              color: activeTeam.color,
              backgroundColor: activeTeam.color + '20',
            }}
          >
            {activeLineup.formation}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">Progreso:</span>
          <span className="text-white font-bold text-sm">
            {progress}/{total}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-3 bg-gray-700 rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progressPercent}%`,
            backgroundColor: progress === total && total > 0 ? '#22c55e' : activeTeam.color,
          }}
        />
      </div>
    </div>
  )
}
