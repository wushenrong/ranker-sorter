import type { Ratings } from './schema'

export type EloSystem = Record<string, Ratings>
export type Score = 0.0 | 0.5 | 1.0
export type MatchResult = 'win' | 'loss' | 'draw'

export const DEFAULT_RATINGS = {
  elo: 1000,
  wins: 0,
  losses: 0,
  draws: 0,
}

const DEFAULT_K_FACTOR = 32

const calculateExpectedScore = (ratingA: number, ratingB: number) =>
  1 / (1 + 10 ** ((ratingB - ratingA) / 400))

export const recordMatch = (
  system: EloSystem,
  playerA: string,
  playerB: string,
  score: Score,
  kFactor = DEFAULT_K_FACTOR,
) => {
  const ratingA = system[playerA].elo
  const ratingB = system[playerB].elo

  const expectedA = calculateExpectedScore(ratingA, ratingB)
  const expectedB = 1 - expectedA

  // Flooring to be conservative and have a consistent rounding
  const newRatingA = Math.floor(ratingA + kFactor * (score - expectedA))
  const newRatingB = Math.floor(ratingB + kFactor * (1 - score - expectedB))

  const result = score === 1 ? 'win' : score === 0 ? 'loss' : 'draw'

  const updateStats = (player: string, result: MatchResult) => {
    const current = system[player]
    return {
      elo: player === playerA ? newRatingA : newRatingB,
      wins: current.wins + (result === 'win' ? 1 : 0),
      losses: current.losses + (result === 'loss' ? 1 : 0),
      draws: current.draws + (result === 'draw' ? 1 : 0),
    }
  }

  return {
    ...system,
    [playerA]: updateStats(playerA, result),
    [playerB]: updateStats(
      playerB,
      result === 'win' ? 'loss' : result === 'loss' ? 'win' : result,
    ),
  }
}
