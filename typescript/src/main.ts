import { addMediaTypePlugin } from '@hyperjump/json-schema'

import { ELO_SYSTEM, rankPlayers } from './ranker/rankPlayers'
import { results_saved } from './ranker/displayResults'

import { loadFile, type PlayerList } from './loadFile'
import { combinations } from './math'

import './style.css'

addMediaTypePlugin('application/json', {
  parse: async (response) => [JSON.parse(await response.text()), undefined],
  matcher: (path) => path.endsWith('.json')
})

const APP = document.querySelector<HTMLDivElement>('#app')!

let ranker_created = false

const createRanker = (data: PlayerList): void => {
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

const getPlayerList = async (): Promise<void> => {
  createRanker(await loadFile(button))
}

const button = document.querySelector<HTMLInputElement>('#load')!
button.addEventListener('change', () => {
  void getPlayerList()
})

window.addEventListener('beforeunload', (e) => {
  if (!ranker_created || results_saved) return
  e.returnValue = true
})
