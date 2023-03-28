import EloSystem from 'elo-system'

import { displayResults } from './displayResults'
import { type PlayerList } from './createRanker'

export const ELO_SYSTEM = new EloSystem()
let player_a_index = 0
let player_b_index = 1

export const rankPlayers = (data: PlayerList, playerAWon: boolean, draw: boolean): void => {
  const _playerAButton = document.querySelector<HTMLButtonElement>('#player-a')!
  const _playerBButton = document.querySelector<HTMLButtonElement>('#player-b')!
  const _draw = document.querySelector<HTMLButtonElement>('#draw')!
  const _numOfPlayers = data.players.length - 1
  let winner: string
  let loser: string

  if (playerAWon) {
    winner = data.players[player_a_index]
    loser = data.players[player_b_index]
  } else {
    winner = data.players[player_b_index]
    loser = data.players[player_a_index]
  }

  ELO_SYSTEM.record_match({ winner, loser, draw })

  player_b_index += 1

  if (player_b_index > _numOfPlayers) {
    player_a_index += 1
    player_b_index = player_a_index + 1
    _playerAButton.innerHTML = `${data.players[player_a_index]}`
  }

  if (player_a_index !== _numOfPlayers) {
    _playerBButton.innerHTML = `${data.players[player_b_index]}`
    return
  }

  _playerAButton.remove()
  _playerBButton.remove()
  _draw.remove()

  displayResults(data, ELO_SYSTEM)
}
