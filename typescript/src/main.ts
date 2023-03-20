import {
  Chart, Title, Tooltip, BarController, BarElement,
  CategoryScale, LinearScale, Legend
} from 'chart.js'
import { saveAs } from 'file-saver'

import './style.css'
import { combination } from './math'
import Container from './container'

const app = document.querySelector<HTMLDivElement>('#app')!

const displayResults = (data: Container): void => {
  const results = data.elo.get_overall_list()
  const stats = document.createElement('div')
  stats.className = 'stats'
  stats.innerHTML = `
    <canvas id="results" aria-label="Results" role="img"></canvas>
    <button id="save-results">Save Results</button>
    <button id="save-chart">Save Chart</button>
  `

  app.appendChild(stats)

  Chart.defaults.backgroundColor = '#FFFFFF'

  Chart.register(
    Title,
    Tooltip,
    BarController,
    BarElement,
    CategoryScale,
    LinearScale,
    Legend
  )

  const ctx = document.querySelector<HTMLCanvasElement>('#results')!
  // eslint-disable-next-line no-new
  new Chart(
    ctx,
    {
      type: 'bar',
      data: {
        labels: results.map(player => player.player),
        datasets: [
          { label: 'Ratings (Elo)', data: results.map(player => player.elo) }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: data.name
          }
        }
      }
    })

  const saveButton = document.querySelector<HTMLButtonElement>('#save-results')!
  const saveChartButton = document.querySelector<HTMLButtonElement>('#save-chart')!

  saveButton.addEventListener('click', () => {
    const download = 'data:application/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify({ name: data.name, players: data }, undefined, 2)
    )
    saveAs(download, 'results.json')
  })

  saveChartButton.addEventListener('click', () => {
    ctx.toBlob(blob => { saveAs(blob!, 'chart.png') })
  })
}

const rankPlayers = (data: Container, playerAWon: boolean, draw: boolean): void => {
  const playerAButton = document.querySelector<HTMLButtonElement>('#player-a')!
  const playerBButton = document.querySelector<HTMLButtonElement>('#player-b')!
  const NUM_OF_PLAYERS = data.players.length - 1
  let winner: string
  let loser: string

  if (playerAWon) {
    winner = data.players[data.index_i]
    loser = data.players[data.index_j]
  } else {
    winner = data.players[data.index_j]
    loser = data.players[data.index_i]
  }

  data.elo.record_match({ winner, loser, draw })

  data.index_j += 1

  if (data.index_j > NUM_OF_PLAYERS) {
    data.index_i += 1
    data.index_j = data.index_i + 1
    playerAButton.innerHTML = `${data.players[data.index_i]}`
  }

  if (data.index_i !== NUM_OF_PLAYERS) {
    playerBButton.innerHTML = `${data.players[data.index_j]}`
    return
  }

  playerAButton.remove()
  playerBButton.remove()
  document.querySelector<HTMLButtonElement>('#draw')!.remove()

  data.players.forEach(element => {
    data.elo.record_match({ winner: element, loser: element, draw: true })
  })

  displayResults(data)
}

const createRanker = (data: Container): void => {
  app.innerHTML = `
    <p>
      There are ${combination(data.players.length, 2)} combinations of 2
      players for ${data.players.length}.
    </p>
    <button id="player-a"></button>
    <button id="draw">Both are equal / I do not care</button>
    <button id="player-b"></button>
  `

  const playerA = document.querySelector<HTMLButtonElement>('#player-a')!
  const playerB = document.querySelector<HTMLButtonElement>('#player-b')!
  const draw = document.querySelector<HTMLButtonElement>('#draw')

  playerA.innerHTML = `${data.players[data.index_i]}`
  playerB.innerHTML = `${data.players[data.index_j]}`
  playerA?.addEventListener('click', () => { rankPlayers(data, true, false) })
  playerB?.addEventListener('click', () => { rankPlayers(data, false, false) })
  draw?.addEventListener('click', () => { rankPlayers(data, false, true) })
}

const loadFile = async (element: HTMLInputElement): Promise<void> => {
  const infoParagraph = document.querySelector<HTMLParagraphElement>('.info')!

  if (element.files == null) {
    infoParagraph.textContent = 'Please select a file.'
    return
  }

  const file = element.files[0]

  if (file.type !== 'application/json') {
    infoParagraph.textContent = `File name ${file.name}: Not a valid JSON file`
    return
  }

  const data = JSON.parse(await file.text())
  createRanker(new Container(data))
}

const button = document.querySelector<HTMLInputElement>('#load')!
button.addEventListener('change', () => { void loadFile(button) })
