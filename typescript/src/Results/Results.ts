import { type Results } from '.'

export default function setupResults (results: Results): void {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <h2>${results.name}</h2>
    <div class="results"></div>
    <button id="save-results">Save Results</button>
    <button id="new-ranker">New Ranker</button>
  `

  const _saveButton = document.querySelector<HTMLButtonElement>('#save-results')!
  const saveFile = (data: any, fileName = 'results.json'): void => {
    const _href = URL.createObjectURL(
      new Blob([data], { type: 'octet-stream' })
    )

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

  _saveButton.addEventListener('click', () => {
    saveFile(JSON.stringify(results, undefined, 2))
  })
}

// export const displayResults = (playerList: PlayerList, eloSystem: EloSystem): void => {
//   const _results = eloSystem.get_overall_list()

//   const _newButton = document.querySelector<HTMLButtonElement>('#new-ranker')!

//   _newButton.addEventListener('click', () => { window.location.reload() })
// }
