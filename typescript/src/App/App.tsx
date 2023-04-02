import { useState } from 'react'

import ListLoader from '../ListLoader'
import Ranker from '../Ranker'
import Results from '../Results'
import './App.css'

function App (): JSX.Element {
  const [players, setPlayer] = useState(undefined)
  const [results, setResults] = useState(undefined)

  const getPlayers = (playerList: any): void => {
    setPlayer(playerList)
  }

  const getResults = (results: any): void => {
    setResults(results)
  }

  if (players === undefined) {
    return <ListLoader callback={getPlayers} />
  }

  if (results === undefined) {
    return <Ranker data={players} callback={getResults} />
  }

  return (
    <Results
      results={results}
      resetData={getPlayers}
      resetResults={getResults}
    />
  )
}

export default App
