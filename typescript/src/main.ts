import { addMediaTypePlugin } from '@hyperjump/json-schema'

import setupFileLoader from './FileLoader'
import setupRanker, { type PlayerList } from './Ranker'
import setupResults from './Results'

import './style.scss'

addMediaTypePlugin('application/json', {
  parse: async (response) => [JSON.parse(await response.text()), undefined],
  matcher: (path) => path.endsWith('.json')
})

const createRanker = (players: PlayerList): void => {
  setupRanker(players, setupResults)
}

setupFileLoader(document.querySelector<HTMLInputElement>('#load')!, createRanker)

// window.addEventListener('beforeunload', (event) => {
//   event.preventDefault()
//   if (!ranker_created || results_saved) return
//   event.returnValue = true
// })
