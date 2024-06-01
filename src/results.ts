import type { RankerResults } from './schemas'

import { APP, addImageToElement, beforeUnloadEventListener, createBrBlockedParagraph } from './html-helpers'

const TABLE_HEADINGS = [
  'Rank',
  'Character',
  'Elo',
  'Wins',
  'Losses',
  'Draws',
]

const newRankerListener = () => window.location.reload()

function saveFile<T>(data: T, filename: string) {
  const json = JSON.stringify(data, undefined, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const href = URL.createObjectURL(blob)
  const a = document.createElement('a')

  a.href = href
  a.download = filename

  document.body.append(a)

  a.click()
  a.remove()

  URL.revokeObjectURL(href)
}

function createTableHead(headings: string[]) {
  const tableHead = document.createElement('thead')
  const tableRow = document.createElement('tr')

  for (const heading of headings) {
    const column = document.createElement('th')
    column.textContent = heading
    column.scope = 'col'
    tableRow.append(column)
  }

  tableHead.append(tableRow)

  return tableHead
}

export function displayResults(results: RankerResults) {
  const saveResultsListener = () => {
    saveFile(results, `${results.title}-results.json`)
    window.removeEventListener('beforeunload', beforeUnloadEventListener)
  }

  const table = document.createElement('table')
  const tableCaption = document.createElement('caption')
  const tableHead = createTableHead(TABLE_HEADINGS)
  const tableBody = document.createElement('tbody')
  const saveMessage = createBrBlockedParagraph('Do not forget to save your results.')
  const saveButton = document.createElement('button')
  const newButton = document.createElement('button')

  tableCaption.textContent = `Result of Ranking "${results.title}" Character`

  saveMessage.role = 'alert'

  saveButton.textContent = 'Save Results'
  saveButton.type = 'button'
  saveButton.className = 'result-buttons'
  newButton.textContent = 'New Ranker (Reloads Page)'
  newButton.type = 'button'
  newButton.className = 'result-buttons'

  table.append(tableCaption, tableHead, tableBody)

  APP.replaceChildren(table, saveMessage, saveButton, newButton)

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
