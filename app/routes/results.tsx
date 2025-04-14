import * as zod from '@zod/mini'

import { rankerResults } from '~/schema'

import { Link } from 'react-router'
import type { Route } from './+types/results'

const TABLE_HEADINGS = [
  'Rank',
  'Player',
  'Elo',
  'Wins',
  'Losses',
  'Draws',
] as const

export async function clientAction({ request }: Route.ClientActionArgs) {
  const rankerResultsData = await request.json()
  const result = rankerResults.safeParse(rankerResultsData)

  if (!result.success) {
    return { ok: false as const, error: zod.prettifyError(result.error) }
  }

  return { ok: true as const, data: result.data }
}

export default function Results({ actionData }: Route.ComponentProps) {
  if (!actionData || !actionData?.ok) {
    return (
      <>
        {actionData?.error ? (
          <>
            <p className="text-center">Error: Unable to load ranker results</p>
            <p className="text-center whitespace-pre-wrap">
              {actionData.error}
            </p>
          </>
        ) : (
          <p>
            Error: Unable to create ranker results. Did you accidentally
            refreshed the browser?
          </p>
        )}
        <Link to={'/'} replace>
          Go back home
        </Link>
      </>
    )
  }

  const results = actionData.data

  return (
    <>
      <p role="alert">Do not forget to save your results!</p>
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
              <td>{index + 1}</td>
              <th scope="row">{player.name}</th>
              <td>{player.elo}</td>
              <td>{player.wins}</td>
              <td>{player.losses}</td>
              <td>{player.draws}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
