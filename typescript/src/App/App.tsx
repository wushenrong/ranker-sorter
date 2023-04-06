import { Suspense, lazy, useState } from 'react'

import LoadList from '../LoadList'
import Loading from '../components/Loading'

const Ranker = lazy(async () => await import('../Ranker'))
const Results = lazy(async () => await import('../Results'))

function App (): JSX.Element {
  const [players, setPlayer] = useState(undefined)
  const [results, setResults] = useState(undefined)

  const getPlayers = (playerList: any): void => { setPlayer(playerList) }
  const getResults = (results: any): void => { setResults(results) }

  if (players === undefined) {
    return <LoadList callback={getPlayers} />
  }

  if (results === undefined) {
    return (
      <Suspense fallback={<Loading />}>
        <Ranker data={players} callback={getResults} />
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<Loading />}>
      <Results
        results={results} resetData={getPlayers} resetResults={getResults}
      />
    </Suspense>
  )
}

export default App
