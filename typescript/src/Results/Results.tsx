import Button from '../components/Button'

import { type RankerResults } from '.'

type ResultProps = {
  results: RankerResults
  resetData: (playerList: any) => void
  resetResults: (results: any) => void
}

function Results ({ results, resetData, resetResults }: ResultProps): JSX.Element {
  const saveFile = (data: any, filename = 'results.json'): void => {
    const blob = new Blob([data], { type: 'octet-stream' })
    const href = URL.createObjectURL(blob)

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
    URL.revokeObjectURL(href)
    a.remove()
  }

  const onClick = (data: any) => () => { saveFile(data) }

  const newRanker = (): void => {
    resetData(undefined)
    resetResults(undefined)
  }

  return (
    <>
      <h2>{results.name}</h2>
      <Button type='button' onClick={() => { newRanker() }}>New Ranker</Button>
      <Button type='button' onClick={onClick(results)}>Save Results</Button>
    </>
  )
}

export default Results
