import { type PlayerStatistics } from 'js-elo-system'
import { Suspense, lazy, useContext /* , useRef */ } from 'react'
import { CallbackContext } from '../context'

const Charts = lazy(async () => import('./Charts'))

export interface Results {
  title: string
  players: PlayerStatistics[]
}

function Loading() {
  return (
    <p>
      <i>Loading ...</i>
    </p>
  )
}

function Result({ data }: { data: Results }) {
  const callback = useContext(CallbackContext)
  // const [chartRef, setChartRef] = useRef<HTMLElement | null>()

  const newRanker = () => callback(undefined)

  const saveFile = (href: string, filename: string) => {
    const a = Object.assign(document.createElement('a'), {
      href,
      style: 'display:none',
      download: filename,
    })

    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const saveResults = () => {
    const json = JSON.stringify(data)
    const blob = new Blob([json], { type: 'application/json' })
    const href = URL.createObjectURL(blob)

    saveFile(href, 'results.json')
    URL.revokeObjectURL(href)
  }

  /* const saveCharts = () => {
    if (chartRef == null) return
    if (chartRef.firstChild == null) return

    const xml = new XMLSerializer().serializeToString(chartRef.firstChild)
    const href = 'data:image/svg+xml,' + xml

    saveFile(href, 'chart.svg')
  } */

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Charts data={data} />
      </Suspense>
      <button type='button' onClick={newRanker}>
        New Ranker
      </button>
      <button type='button' onClick={saveResults}>
        Save Results
      </button>
      {/* <button type='button' onClick={saveCharts}>
        Save Charts
      </button> */}
    </>
  )
}

export default Result
