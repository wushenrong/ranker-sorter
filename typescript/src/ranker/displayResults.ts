import 'chartist/dist/index.css'
import { BarChart } from 'chartist'

import type EloSystem from 'elo-system'
import { type PlayerList } from '../loadFile'

export let results_saved = false

const saveFile = (data: any, fileName = 'results.json'): void => {
  const _href = URL.createObjectURL(new Blob([data], { type: 'octet-stream' }))

  const _a = Object.assign(
    document.createElement('a'),
    {
      href: _href,
      style: 'display:none',
      download: fileName
    }
  )
  document.body.appendChild(_a)

  _a.click()
  URL.revokeObjectURL(_href)
  _a.remove()
}

export const displayResults = (playerList: PlayerList, eloSystem: EloSystem): void => {
  const _results = eloSystem.get_overall_list()
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
      labels: _results.map(player => { return player.player }),
      series: [
        _results.map(player => { return player.elo })
      ]
    }
  )

  const _saveButton = document.querySelector<HTMLButtonElement>('#save-results')!
  const _newButton = document.querySelector<HTMLButtonElement>('#new-ranker')!
  _saveButton.addEventListener('click', () => {
    const data = {
      name: playerList.name,
      baseElo: eloSystem.base_elo,
      kFactor: eloSystem.k_factor,
      players: _results
    }
    saveFile(JSON.stringify(data, undefined, 2))
    results_saved = true
  })
  _newButton.addEventListener('click', () => { window.location.reload() })
}
