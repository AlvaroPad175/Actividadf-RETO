'use client'

import { Lineup, Player } from '@/types'
import PlayerInput from './PlayerInput'

interface LineupGridProps {
  lineup: Lineup
  guessedPlayers: Set<string>
  revealedPlayers: Set<string>
  onCorrectGuess: (playerId: string) => void
}

function parseFormation(formation: string): number[] {
  return formation.split('-').map(Number)
}

function groupPlayersByPosition(players: Player[], formation: string): Player[][] {
  const rows: Player[][] = []
  const formationNums = parseFormation(formation)

  const gk = players.filter((p) => p.position === 'GK')
  const defenders = players.filter((p) => p.position === 'DEF')
  const midfielders = players.filter((p) => p.position === 'MID')
  const forwards = players.filter((p) => p.position === 'FWD')

  // For formations like 4-2-3-1, 4-3-3, 4-4-2
  // formationNums[0] = defenders, last = forwards, middle = mids
  const numDefs = formationNums[0]
  const numFwds = formationNums[formationNums.length - 1]
  const midRows = formationNums.slice(1, -1)

  // Build rows from top (FWD) to bottom (GK) - football pitch style
  // FWD rows
  if (forwards.length > 0) {
    rows.push(forwards.slice(0, numFwds))
  }

  // MID rows - split midfielders into sub-rows if multiple mid layers
  let midStart = 0
  for (const midCount of midRows) {
    const rowPlayers = midfielders.slice(midStart, midStart + midCount)
    if (rowPlayers.length > 0) rows.push(rowPlayers)
    midStart += midCount
  }

  // If no mid sub-rows but have midfielders
  if (midRows.length === 0 && midfielders.length > 0) {
    rows.push(midfielders)
  }

  // DEF row
  if (defenders.length > 0) {
    rows.push(defenders.slice(0, numDefs))
  }

  // GK row
  if (gk.length > 0) {
    rows.push(gk)
  }

  return rows
}

export default function LineupGrid({
  lineup,
  guessedPlayers,
  revealedPlayers,
  onCorrectGuess,
}: LineupGridProps) {
  const rows = groupPlayersByPosition(lineup.players, lineup.formation)

  return (
    <div className="flex flex-col gap-3">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`grid gap-3`}
          style={{
            gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
          }}
        >
          {row.map((player) => (
            <PlayerInput
              key={player.id}
              player={player}
              onCorrectGuess={onCorrectGuess}
              revealed={revealedPlayers.has(player.id)}
              isGuessed={guessedPlayers.has(player.id)}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
