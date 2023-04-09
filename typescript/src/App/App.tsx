/*! SPDX-FileCopyrightText: 2023 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import { Suspense, lazy, useState } from 'react'

import LoadList from '../LoadList'
import Loading from '../Loading'

import type { PlayerList } from '../hooks/useEloSystem'
import type { RankerResults } from '../Results'

const Ranker = lazy(async () => await import('../Ranker'))
const Results = lazy(async () => await import('../Results'))

function App (): JSX.Element {
  const [players, setPlayer] = useState<PlayerList | undefined>(undefined)
  const [results, setResults] = useState<RankerResults | undefined>(undefined)

  const getPlayers = (playerList: PlayerList | undefined): void => {
    setPlayer(playerList)
  }
  const getResults = (results: RankerResults | undefined): void => {
    setResults(results)
  }

  if (players === undefined) return <LoadList callback={getPlayers} />

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
