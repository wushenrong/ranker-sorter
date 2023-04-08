/*! SPDX-FileCopyrightText: 2023 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import { Suspense, lazy, useRef } from 'react'
import type EChartsReactCore from 'echarts-for-react/lib/core'

import Loading from '../components/Loading'
import type { RankerResults } from '.'

type ResultProps = {
  results: RankerResults
  resetResults: (results: undefined) => void
  resetData: (playerList: undefined) => void
}

const Chart = lazy(async () => await import('./Chart'))

function Results ({ results, resetData, resetResults }: ResultProps): JSX.Element {
  const chartRef = useRef<EChartsReactCore>(null)

  const newRanker = (): void => {
    resetData(undefined)
    resetResults(undefined)
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

  const onSave = (data: any) => () => {
    const blob = new Blob([data], { type: 'octet-stream' })
    const href = URL.createObjectURL(blob)
    saveFile(href)
    URL.revokeObjectURL(href)
  }

  const saveChart = (): void => {
    const chartInstance = chartRef.current?.getEchartsInstance()
    const chartHref = chartInstance?.getDataURL()

    if (chartHref === undefined) return

    saveFile(chartHref, 'chart.svg')
  }

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Chart results={results} ref={chartRef} />
      </Suspense>
      <button type='button' onClick={() => { newRanker() }}>New Ranker</button>
      <button type='button' onClick={onSave(results)}>Save Results</button>
      <button type='button' onClick={() => { saveChart() }}>Save Chart</button>
    </>
  )
}

export default Results
