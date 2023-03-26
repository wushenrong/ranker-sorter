import 'chartist/dist/index.css'
import { BarChart } from 'chartist'

import type EloSystem from 'elo-system'
import { type PlayerList } from '../loadFile'

export let resultsSaved = false

const saveFile = (data: any, fileName = 'results.json'): void => {
  const blob = new Blob([data], { type: 'octet-stream' })
  const href = URL.createObjectURL(blob)

  const a = Object.assign(
    document.createElement('a'),
    {
      href,
      style: 'display:none',
      download: fileName
    }
  )
  document.body.appendChild(a)

  a.click()
  URL.revokeObjectURL(href)
  a.remove()
}

export const displayResults = (playerList: PlayerList, eloSystem: EloSystem): void => {
  const results = eloSystem.get_overall_list()
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <h2>${playerList.name}</h2>
    <div class="results"></div>
    <button id="save-results">Save Results</button>
    <button id="new-ranker">New Ranker</button>
  `

  // eslint-disable-next-line no-new
  new BarChart(
    '.results',
    {
      labels: results.map(player => { return player.player }),
      series: [
        results.map(player => { return player.elo })
      ]
    }
  )

  const saveButton = document.querySelector<HTMLButtonElement>('#save-results')!
  const newButton = document.querySelector<HTMLButtonElement>('#new-ranker')!
  saveButton.addEventListener('click', () => {
    const data = {
      name: playerList.name,
      baseElo: eloSystem.base_elo,
      kFactor: eloSystem.k_factor,
      players: results
    }
    saveFile(JSON.stringify(data, undefined, 2))
    resultsSaved = true
  })
  newButton.addEventListener('click', () => { window.location.reload() })
}
