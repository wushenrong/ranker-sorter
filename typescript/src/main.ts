import { addMediaTypePlugin } from '@hyperjump/json-schema'

import { eloSystem, rankPlayers } from './ranker/rankPlayers'
import { resultsSaved } from './ranker/displayResults'

import { loadFile, type PlayerList } from './loadFile'
import { combinations } from './math'

import './style.css'

addMediaTypePlugin('application/json', {
  parse: async (response) => [JSON.parse(await response.text()), undefined],
  matcher: (path) => path.endsWith('.json')
})

const app = document.querySelector<HTMLDivElement>('#app')!

let rankerCreated = false

const createRanker = (data: PlayerList): void => {
  rankerCreated = true
  data.players.forEach(player => { eloSystem.add_player(player) })

  const comb: number = combinations(data.players.length, 2)
  app.innerHTML = `
    <p id="info">
      There are ${comb} combinations of 2 players for ${data.players.length}
      players.
      <br>
      This will take you about ${comb / 6} minutes if each choice takes about 10
      seconds.
    </p>
    <button id="player-a" class="selection"></button>
    <button id="draw" class="selection">Both are equal</button>
    <button id="player-b" class="selection"></button>
  `

  const playerA = document.querySelector<HTMLButtonElement>('#player-a')!
  const playerB = document.querySelector<HTMLButtonElement>('#player-b')!
  const draw = document.querySelector<HTMLButtonElement>('#draw')!

  playerA.innerHTML = `${data.players[0]}`
  playerB.innerHTML = `${data.players[1]}`
  playerA.addEventListener('click', () => { rankPlayers(data, true, false) })
  playerB.addEventListener('click', () => { rankPlayers(data, false, false) })
  draw.addEventListener('click', () => { rankPlayers(data, false, true) })
}

const getPlayerList = async (): Promise<void> => {
  createRanker(await loadFile(button))
}

const button = document.querySelector<HTMLInputElement>('#load')!
button.addEventListener('change', () => {
  void getPlayerList()
})

window.addEventListener('beforeunload', (e) => {
  if (!rankerCreated || resultsSaved) return
  e.returnValue = true
})
