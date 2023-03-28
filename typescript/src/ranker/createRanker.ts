import { ELO_SYSTEM, rankPlayers } from './rankPlayers'
import { combinations } from './math'

export interface PlayerList { name: string, players: string[] }

export let ranker_created = false

const APP = document.querySelector<HTMLDivElement>('#app')!

export const createRanker = (data: PlayerList): void => {
  ranker_created = true
  data.players.forEach(player => { ELO_SYSTEM.add_player(player) })

  const _comb: number = combinations(data.players.length, 2)
  APP.innerHTML = `
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

  _playerA.innerHTML = `${data.players[0]}`
  _playerB.innerHTML = `${data.players[1]}`
  _playerA.addEventListener('click', () => { rankPlayers(data, true, false) })
  _playerB.addEventListener('click', () => { rankPlayers(data, false, false) })
  _draw.addEventListener('click', () => { rankPlayers(data, false, true) })
}
