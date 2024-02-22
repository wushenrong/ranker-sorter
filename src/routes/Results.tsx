import { Link, useActionData } from 'react-router-dom'

import { result } from '../app/schemas.ts'
import Button from '../components/Button.tsx'
import IconImage from '../components/IconImage.tsx'
import styles from '../styles/Results.module.css'

const tableHeadings = [
  'Rank',
  'Character',
  'Elo',
  'Wins',
  'Losses',
  'Draws',
] as const

function Results() {
  const actionData = useActionData()
  const results = result.safeParse(actionData)

  if (!results.success) {
    throw new Error(
      'No ranker loaded. Did you accidentally refreshed the Browser?',
    )
  }

  const saveResults = () => {
    const json = JSON.stringify(results.data)
    const blob = new Blob([json], { type: 'application/json' })
    const href = URL.createObjectURL(blob)

    const a = Object.assign(document.createElement('a'), {
      download: `${results.data.title}-results.json`,
      href,
      style: 'display:none',
    })

    document.body.append(a)
    a.click()
    a.remove()

    URL.revokeObjectURL(href)
  }

  return (
    <>
      <p role="alert">Do not forget to save your results.</p>

      <table className={styles.results}>
        <caption className={styles.caption}>
          Result of Ranking
          {' '}
          {results.data.title}
        </caption>
        <thead className={styles.statCategories}>
          <tr>
            {
              tableHeadings.map((heading) => {
                return (
                  <th className={styles.category} key={heading} scope="col">
                    {heading}
                  </th>
                )
              })
            }
          </tr>
        </thead>
        <tbody>
          {
            results.data.players.map((player, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <th className={styles.character} scope="row">
                    {
                      player.image == undefined
                        ? player.name
                        : <IconImage alt={player.name} src={player.image} />
                    }
                  </th>
                  <td>{player.elo}</td>
                  <td>{player.wins}</td>
                  <td>{player.losses}</td>
                  <td>{player.draws}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>

      <Button
        className={styles.saveButton}
        onClick={saveResults}
        type="button"
      >
        Save Results
      </Button>

      <div>
        <Link to="/">Back To The Beginning</Link>
      </div>
    </>
  )
}

export default Results
