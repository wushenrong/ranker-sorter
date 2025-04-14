import * as zod from '@zod/mini'

import { combinations } from 'mathjs'
import { useEffect, useState } from 'react'
import { Link, useSubmit } from 'react-router'

import { DEFAULT_RATINGS, recordMatch } from '~/elosystem'
import { customRanker } from '~/schema'

import type { EloSystem, Score } from '~/elosystem'
import type { Player } from '~/schema'
import type { Route } from './+types/ranker'

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData()
  const file = formData.get('custom-ranker')

  if (!(file instanceof File) || !file.size) {
    return { ok: false as const, error: 'No file was selected' }
  }

  if (file.type !== 'application/json') {
    return { ok: false as const, error: 'File is not a JSON file' }
  }

  const rankerData = JSON.parse(await file.text())
  const result = customRanker.safeParse(rankerData)

  if (!result.success) {
    return { ok: false as const, error: zod.prettifyError(result.error) }
  }

  return { ok: true as const, data: result.data }
}

export default function Ranker({ actionData }: Route.ComponentProps) {
  if (!actionData || !actionData.ok) {
    return (
      <>
        {actionData?.error ? (
          <>
            <p className="text-center whitespace-pre-wrap">
              Error: Unable to load ranker data
            </p>
            <p className="text-center whitespace-pre-wrap">
              {actionData.error}
            </p>
          </>
        ) : (
          <p>
            Error: Unable to create ranker. Did you accidentally refreshed the
            browser?
          </p>
        )}
        <Link to={'/'} replace>
          Go back home
        </Link>
      </>
    )
  }

  const submit = useSubmit()
  const [ratings, setRatings] = useState<EloSystem>({})
  const [currentProgress, setCurrentProgress] = useState(0)
  const [currentPlayerA, setCurrentPlayerA] = useState(0)
  const [currentPlayerB, setCurrentPlayerB] = useState(1)

  const players = actionData.data.players

  useEffect(() => {
    const system = players.reduce((acc, player) => {
      const name = typeof player === 'string' ? player : player.name

      acc[name] = { ...DEFAULT_RATINGS }

      return acc
    }, {} as EloSystem)

    setRatings(system)
  }, [players])

  const getPlayerName = (player: string | Player) => {
    return typeof player === 'undefined'
      ? ''
      : typeof player === 'string'
        ? player
        : player.name
  }

  const onClick = (playerA: string, playerB: string, score: Score) => {
    return () => {
      const newRatings = recordMatch(ratings, playerA, playerB, score)

      setRatings(newRatings)
      setCurrentPlayerB((count) => count + 1)

      if (currentPlayerB >= players?.length - 1) {
        setCurrentPlayerA((count) => count + 1)
        setCurrentPlayerB(() => currentPlayerA + 2)
      }

      setCurrentProgress((count) => count + 1)
    }
  }

  const viewResults = () => {
    const results = {
      title: actionData.data.title,
      players: players
        .map((player) => {
          const name = typeof player !== 'string' ? player.name : player
          const image = typeof player !== 'string' ? player.image : undefined

          return {
            ...ratings[name],
            name,
            image: image,
          }
        })
        .sort((playerA, playerB) => playerB.elo - playerA.elo),
    }

    submit(JSON.stringify(results), {
      action: '/results',
      encType: 'application/json',
      method: 'post',
      replace: true,
    })
  }

  const combination = combinations(players.length, 2)
  const estimatedTime = Math.ceil(combination / 60)
  const playerAName = getPlayerName(players[currentPlayerA])
  const playerBName = getPlayerName(players[currentPlayerB])

  return (
    <>
      {currentProgress < combination ? (
        <>
          <p>
            There are {combination} combination{combination > 1 ? 's' : ''} of 2
            players for {players.length} players. This will take about{' '}
            {estimatedTime} minute{estimatedTime > 1 ? 's' : ''} if each choice
            takes a second.
          </p>
          <p>
            Current progress: {currentProgress}/{combination}
          </p>
          <div>
            <button
              className="p-4"
              type="button"
              onClick={onClick(playerAName, playerBName, 1.0)}
            >
              {playerAName}
            </button>
            <button
              className="p-4"
              type="button"
              onClick={onClick(playerAName, playerBName, 0.5)}
            >
              Draw
            </button>
            <button
              className="p-4"
              type="button"
              onClick={onClick(playerAName, playerBName, 0.0)}
            >
              {playerBName}
            </button>
          </div>
        </>
      ) : (
        <>
          <p role="alert">
            You have completed the ranker, on the next page you will have a
            chance to see and save your results. Remember, do not reload your
            browser as the ranker does not store any store any information on
            your computer.
          </p>
          <button type="button" onClick={viewResults}>
            View Results
          </button>
        </>
      )}
    </>
  )
}
