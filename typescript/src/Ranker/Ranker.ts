import EloSystem from 'js-elo-system'
import { combinations } from 'mathjs'
import './Ranker.module.css'

import { type PlayerList } from '.'
import { type Results } from '../Results'

type CallbackFunction = (data: Results) => void

export default function setupRanker (data: PlayerList, callback: CallbackFunction): void {
  const _comb: number = combinations(data.players.length, 2)
  const _eloSystem = new EloSystem()
  let playerAIndex = 0
  let playerBIndex = 1

  data.players.forEach(player => { _eloSystem.add_player(player) })

  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <p id="info">
      There are ${_comb} combinations of 2 players for ${data.players.length}
      players.
      <br>
      This will take you about ${_comb / 6} minutes if each choice takes about
      10 seconds.
    </p>
    <button id="player-a" class="selection"></button>
    <button id="draw" class="selection">Both are equal</button>
    <button id="player-b" class="selection"></button>
  `

  const _playerA = document.querySelector<HTMLButtonElement>('#player-a')!
  const _playerB = document.querySelector<HTMLButtonElement>('#player-b')!
  const _draw = document.querySelector<HTMLButtonElement>('#draw')!

  const rankPlayers = (playerAWon: boolean, draw: boolean): void => {
    let winner: string
    let loser: string

    if (playerAWon) {
      winner = data.players[playerAIndex]
      loser = data.players[playerBIndex]
    } else {
      winner = data.players[playerBIndex]
      loser = data.players[playerAIndex]
    }

    _eloSystem.record_match({ winner, loser, draw })

    playerBIndex++

    if (playerBIndex > data.players.length - 1) {
      playerAIndex++
      playerBIndex = playerAIndex + 1
      _playerA.innerHTML = `${data.players[playerAIndex]}`
    }

    if (playerAIndex === data.players.length - 1) {
      const results = {
        name: data.name,
        players: _eloSystem.get_overall_list()
      }
      callback(results)
    }

    _playerB.innerHTML = `${data.players[playerBIndex]}`
  }

  _playerA.innerHTML = `${data.players[playerAIndex]}`
  _playerB.innerHTML = `${data.players[playerBIndex]}`
  _playerA.addEventListener('click', () => { rankPlayers(true, false) })
  _playerB.addEventListener('click', () => { rankPlayers(false, false) })
  _draw.addEventListener('click', () => { rankPlayers(false, true) })
}
