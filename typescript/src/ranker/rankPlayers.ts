import EloSystem from 'elo-system'

import { displayResults } from './displayResults'
import { type PlayerList } from '../loadFile'

let IndexI = 0
let IndexJ = 1
export const eloSystem = new EloSystem()

export const rankPlayers = (data: PlayerList, playerAWon: boolean, draw: boolean): void => {
  const playerAButton = document.querySelector<HTMLButtonElement>('#player-a')!
  const playerBButton = document.querySelector<HTMLButtonElement>('#player-b')!
  const NUM_OF_PLAYERS = data.players.length - 1
  let winner: string
  let loser: string

  if (playerAWon) {
    winner = data.players[IndexI]
    loser = data.players[IndexJ]
  } else {
    winner = data.players[IndexJ]
    loser = data.players[IndexI]
  }

  eloSystem.record_match({ winner, loser, draw })

  IndexJ += 1

  if (IndexJ > NUM_OF_PLAYERS) {
    IndexI += 1
    IndexJ = IndexI + 1
    playerAButton.innerHTML = `${data.players[IndexI]}`
  }

  if (IndexI !== NUM_OF_PLAYERS) {
    playerBButton.innerHTML = `${data.players[IndexJ]}`
    return
  }

  playerAButton.remove()
  playerBButton.remove()
  document.querySelector<HTMLButtonElement>('#draw')!.remove()

  displayResults(data, eloSystem)
}
