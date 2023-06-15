/*!
 * SPDX-FileCopyrightText: 2023 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import { Suspense, lazy, useState } from 'react'
import type { ReactElement } from 'react'

import LoadList from './components/load-list'
import Loading from './components/loading'

import type { PlayerList } from './hooks/useEloSystem'
import type { RankerResults } from './components/results'

const Ranker = lazy(async () => await import('./components/ranker'))
const Results = lazy(async () => await import('./components/results'))

export default function App(): ReactElement {
  const [players, setPlayer] = useState<PlayerList | null>(null)
  const [results, setResults] = useState<RankerResults | null>(null)

  const getPlayers = (playerList: PlayerList | null): void => {
    setPlayer(playerList)
  }

  const getResults = (results: RankerResults | null): void => {
    setResults(results)
  }

  if (players == null) return <LoadList callback={getPlayers} />

  if (results == null) {
    return (
      <Suspense fallback={<Loading />}>
        <Ranker data={players} callback={getResults} />
      </Suspense>
    )
  }

  return (
    <Suspense fallback={<Loading />}>
      <Results
        results={results}
        resetData={getPlayers}
        resetResults={getResults}
      />
    </Suspense>
  )
}
