import { addMediaTypePlugin } from '@hyperjump/json-schema'

import { createRanker, ranker_created } from './ranker/createRanker'
import { results_saved } from './ranker/displayResults'
import { loadFile } from './ranker/loadFile'
import './style.css'

addMediaTypePlugin('application/json', {
  parse: async (response) => [JSON.parse(await response.text()), undefined],
  matcher: (path) => path.endsWith('.json')
})

const button = document.querySelector<HTMLInputElement>('#load')!
button.addEventListener('change', () => {
  loadFile(button).then((data) => createRanker(data))
})

window.addEventListener('beforeunload', (e) => {
  if (!ranker_created || results_saved) return
  e.returnValue = true
})
