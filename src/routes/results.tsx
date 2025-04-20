/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import * as zod from '@zod/mini'
import { ActionFunctionArgs, Link, useActionData } from 'react-router'

import { rankerResults } from '~/schemas'

const TABLE_HEADINGS = [
  'Rank',
  'Player',
  'Elo',
  'Wins',
  'Losses',
  'Draws',
] as const

export async function action({ request }: ActionFunctionArgs) {
  const rankerResultsData = await request.json()
  const result = rankerResults.safeParse(rankerResultsData)

  if (!result.success) {
    return { error: zod.prettifyError(result.error), ok: false as const }
  }

  return { data: result.data, ok: true as const }
}

export function Component() {
  const actionData = useActionData<typeof action>()

  if (!actionData || !actionData?.ok) {
    return (
      <>
        {actionData?.error ? (
          <div className="load-error">
            <p>Error: Unable to load ranker results</p>
            <p>{actionData.error}</p>
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

  const results = actionData.data

  const saveResults = () => {
    const data = JSON.stringify(results)
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
        <caption>Result of ranking: {results.title}</caption>
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
          {results.players.map((player, index) => (
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
              <td>{index + 1}</td>
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
