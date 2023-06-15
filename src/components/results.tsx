/*!
 * SPDX-FileCopyrightText: 2023 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import type EChartsReactCore from 'echarts-for-react/lib/core'

import { Suspense, lazy, useRef } from 'react'
import type { ReactElement } from 'react'

import type { OverallStatistics } from 'js-elo-system'

import Loading from './loading'

export type RankerResults = { name: string, players: OverallStatistics }

type ResultProps = {
  results: RankerResults
  resetResults: (results: null) => void
  resetData: (playerList: null) => void
}

const Chart = lazy(async () => await import('./chart'))

export default function Results ({ results, resetData, resetResults }: ResultProps): ReactElement {
  const chartRef = useRef<EChartsReactCore>(null)

  const newRanker = (): void => {
    resetData(null)
    resetResults(null)
  }

  const saveFile = (href: string, filename = 'results.json'): void => {
    const a = Object.assign(
      document.createElement('a'),
      {
        href,
        style: 'display:none',
        download: filename
      }
    )
    document.body.appendChild(a)

    a.click()
    a.remove()
  }

  function onSave (data: unknown) {
    return () => {
      const blob = new Blob([data as BlobPart], { type: 'octet-stream' })
      const href = URL.createObjectURL(blob)
      saveFile(href)
      URL.revokeObjectURL(href)
    }
  }

  const saveChart = () => {
    return () => {
      const chartInstance = chartRef.current?.getEchartsInstance()
      const chartHref = chartInstance?.getDataURL()

      if (chartHref == null) return

      saveFile(chartHref, 'chart.svg')
    }
  }

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Chart results={results} ref={chartRef} />
      </Suspense>
      <button type='button' onClick={newRanker}>New Ranker</button>
      <button type='button' onClick={onSave(results)}>Save Results</button>
      <button type='button' onClick={saveChart()}>Save Chart</button>
    </>
  )
}
