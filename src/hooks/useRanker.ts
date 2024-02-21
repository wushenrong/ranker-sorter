import { useImmer } from 'use-immer'

import type { Character, Player } from '../app/schemas'

export type EloSystem = Record<string, Player>

export interface MatchRecord {
  player_a: string
  player_b: string
  winner?: string
}

const K_VALUE = 24

function useRanker(characters: Character[]) {
  const [ranker, setRanker] = useImmer(() => {
    const system: EloSystem = {}

    for (const character of characters) {
      system[character.name] = {
        draws: 0,
        elo: 1000,
        losses: 0,
        wins: 0,
      } satisfies Player
    }

    return system
  })

  const recordMatch = (record: MatchRecord) => {
    setRanker((draft) => {
      const playerAElo = draft[record.player_a].elo
      const playerBElo = draft[record.player_b].elo
      const playerARatings = 10 ** (playerAElo / 400)
      const playerBRatings = 10 ** (playerBElo / 400)
      const overallRatings = playerARatings + playerBRatings
      const playerAExpectedScore = playerARatings / overallRatings
      const playerBExpectedScore = playerBRatings / overallRatings

      let playerAScore
      let playerBScore

      if (record.winner === record.player_a) {
        playerAScore = 1
        playerBScore = 0
        draft[record.player_a].wins += 1
        draft[record.player_b].losses += 1
      } else if (record.winner === record.player_b) {
        playerAScore = 0
        playerBScore = 1
        draft[record.player_a].losses += 1
        draft[record.player_b].wins += 1
      } else {
        playerAScore = 0.5
        playerBScore = 0.5
        draft[record.player_a].draws += 1
        draft[record.player_b].draws += 1
      }

      const newPlayerAScore = playerAScore - playerAExpectedScore
      const newPlayerBScore = playerBScore - playerBExpectedScore
      const playerAEloChange = Math.floor(K_VALUE * newPlayerAScore)
      const playerBEloChange = Math.floor(K_VALUE * newPlayerBScore)

      draft[record.player_a].elo = Math.max(playerAElo + playerAEloChange, 0)
      draft[record.player_b].elo = Math.max(playerBElo + playerBEloChange, 0)
    })
  }

  return [ranker, recordMatch] as const
}

export { useRanker }
