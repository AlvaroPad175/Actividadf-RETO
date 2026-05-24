export interface Player {
  id: string
  name: string
  number: number
  position: 'GK' | 'DEF' | 'MID' | 'FWD'
}

export interface Team {
  id: string
  name: string
  shortName: string
  color: string
  secondaryColor: string
}

export interface Lineup {
  formation: string
  players: Player[]
}

export interface Match {
  id: string
  homeTeam: Team
  awayTeam: Team
  homeLineup: Lineup
  awayLineup: Lineup
  date: string
  competition: string
  stage: string
  score?: { home: number; away: number }
}
