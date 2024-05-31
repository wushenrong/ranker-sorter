import type { RankerResults } from './schemas'

import { addImageToElement, beforeUnloadEventListener } from './html-helpers'

const APP = document.querySelector('#app')!

const newRankerListener = () => window.location.reload()

export function displayResults(results: RankerResults) {
  const saveResultsListener = () => {
    const json = JSON.stringify(results, undefined, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const href = URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = href
    a.download = `${results.title}-results.json`

    document.body.append(a)

    a.click()
    a.remove()

    URL.revokeObjectURL(href)

    window.removeEventListener('beforeunload', beforeUnloadEventListener)
  }

  APP.innerHTML = `
    <table>
      <caption></caption>
      <thead>
        <tr>
          <th scope="col">Rank</th>
          <th scope="col">Character</th>
          <th scope="col">Elo</th>
          <th scope="col">Wins</th>
          <th scope="col">Losses</th>
          <th scope="col">Draws</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>
    <p role="alert">Do not forget to save your results.</p>
    <button id="save" type="button">Save Results</button>
    <button id="new" type="button">New Ranker (Reloads Page)</button>
  `

  const tableCaption = APP.querySelector<HTMLTableCaptionElement>('caption')!
  const tableBody = APP.querySelector<HTMLTableSectionElement>('tbody')!
  const saveButton = APP.querySelector<HTMLButtonElement>('#save')!
  const newButton = APP.querySelector<HTMLButtonElement>('#new')!

  tableCaption.textContent = `Result of Ranking "${results.title}" Character`

  for (const [index, player] of results.characters.entries()) {
    const tableRow = document.createElement('tr')
    const rankColumn = document.createElement('td')
    const nameColumn = document.createElement('th')
    const eloColumn = document.createElement('td')
    const winsColumn = document.createElement('td')
    const lossesColumn = document.createElement('td')
    const drawsColumn = document.createElement('td')

    rankColumn.textContent = `${index + 1}`

    addImageToElement(nameColumn, player.name, player.image)
    nameColumn.scope = 'row'

    eloColumn.textContent = `${player.elo}`
    winsColumn.textContent = `${player.wins}`
    drawsColumn.textContent = `${player.draws}`
    lossesColumn.textContent = `${player.losses}`

    tableRow.append(
      rankColumn, nameColumn, eloColumn,
      winsColumn, lossesColumn, drawsColumn,
    )

    tableBody.append(tableRow)
  }

  saveButton.addEventListener('click', saveResultsListener)
  newButton.addEventListener('click', newRankerListener)
}
