/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import { Link, useActionData } from 'react-router'

import { resultsAction } from '~/actions'

const TABLE_HEADINGS = [
  'Player',
  'Rank',
  'Elo',
  'Wins',
  'Losses',
  'Draws',
] as const

export function Results() {
  const actionData = useActionData<typeof resultsAction>()

  const actionResponse = actionData?.ok ? actionData.data : actionData?.error

  if (!actionResponse || typeof actionResponse === 'string') {
    return (
      <>
        {actionResponse ? (
          <div className="load-error">
            <p>Error: Unable to load ranker results</p>
            <p>{actionResponse}</p>
          </div>
        ) : (
          <p>
            Error: Unable to create ranker results. Did you accidentally
            refreshed the browser?
          </p>
        )}
        <Link replace to="/">
          Go back home
        </Link>
      </>
    )
  }

  const saveResults = () => {
    const data = JSON.stringify(actionResponse)
    const blob = new Blob([data], { type: 'application/json' })
    const href = URL.createObjectURL(blob)
    const a = document.createElement('a')

    a.href = href
    a.download = 'ranker-results.json'

    document.body.appendChild(a)

    a.click()
    a.remove()

    URL.revokeObjectURL(href)
  }

  return (
    <>
      <button onClick={saveResults} type="button">
        Save Results
      </button>

      <table>
        <caption>Result of ranking: {actionResponse.title}</caption>
        <thead>
          <tr>
            {TABLE_HEADINGS.map((heading) => (
              <th key={heading} scope="col">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {actionResponse.players.map((player) => (
            <tr key={player.name}>
              <th scope="row">
                {player.image ? (
                  <img
                    alt={player.name}
                    height={64}
                    src={player.image}
                    width={64}
                  />
                ) : (
                  player.name
                )}
              </th>
              <td>{player.rank}</td>
              <td>{player.elo}</td>
              <td>{player.wins}</td>
              <td>{player.losses}</td>
              <td>{player.draws}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link replace to="/">
        Go back home
      </Link>
    </>
  )
}
