/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import * as zod from '@zod/mini'
import { combinations } from 'mathjs'
import { useEffect, useState } from 'react'
import {
  ActionFunctionArgs,
  Link,
  useActionData,
  useSubmit,
} from 'react-router'

import type { EloSystem, Score } from '../app/elosystem'
import { DEFAULT_RATINGS, recordMatch, shuffleArray } from '../app/elosystem'
import { creationForm, customRanker, type Player } from '../app/schemas'

const getPlayerName = (player: string | Player) =>
  typeof player !== 'undefined' && typeof player !== 'string'
    ? player.name
    : player

const getPlayerImage = (player: string | Player) =>
  typeof player !== 'undefined' && typeof player !== 'string'
    ? player.image
    : undefined

export async function action({ request }: ActionFunctionArgs) {
  const formData = Object.fromEntries(await request.formData())
  const formResult = creationForm.safeParse(formData)

  if (!formResult.success) {
    return { error: zod.prettifyError(formResult.error), ok: false as const }
  }

  const rankerData = JSON.parse(await formResult.data['custom-ranker'].text())
  const result = customRanker.safeParse(rankerData)

  if (!result.success) {
    return { error: zod.prettifyError(result.error), ok: false as const }
  }

  const data = {
    players: shuffleArray(result.data.players),
    title: result.data.title,
  }

  return { data, ok: true as const }
}

export function Component() {
  const actionData = useActionData<typeof action>()
  const submit = useSubmit()

  const [ratings, setRatings] = useState<EloSystem>({})
  const [currentProgress, setCurrentProgress] = useState(0)
  const [currentPlayerA, setCurrentPlayerA] = useState(0)
  const [currentPlayerB, setCurrentPlayerB] = useState(1)

  useEffect(() => {
    if (actionData?.data?.players) {
      const system = actionData.data.players.reduce((acc, player) => {
        const name = getPlayerName(player)

        acc[name] = { ...DEFAULT_RATINGS }

        return acc
      }, {} as EloSystem)

      setRatings(system)
    }
  }, [actionData])

  if (!actionData || !actionData.ok) {
    return (
      <>
        {actionData?.error ? (
          <div className="load-error">
            <p>Error: Unable to load ranker data</p>
            <p>{actionData.error}</p>
          </div>
        ) : (
          <p>
            Error: Unable to create ranker. Did you accidentally refreshed the
            browser?
          </p>
        )}
        <Link replace to="/">
          Go back home
        </Link>
      </>
    )
  }

  const players = actionData.data.players

  const select = (playerA: string, playerB: string, score: Score) => {
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
      players: players
        .map((player) => {
          const name = getPlayerName(player)
          const image = getPlayerImage(player)

          return { ...ratings[name], image, name }
        })
        .sort((playerA, playerB) => playerB.elo - playerA.elo),
      title: actionData.data.title,
    }

    submit(JSON.stringify(results), {
      action: '/results',
      encType: 'application/json',
      method: 'post',
      replace: true,
    })
  }

  const combination = combinations(players.length, 2)
  const estimatedMinutes = Math.floor(combination / 60)
  const estimatedSeconds = combination % 60
  const playerAName = getPlayerName(players[currentPlayerA])
  const playerBName = getPlayerName(players[currentPlayerB])
  const playerAImage = getPlayerImage(players[currentPlayerA])
  const playerBImage = getPlayerImage(players[currentPlayerB])

  return (
    <>
      {currentProgress < combination ? (
        <>
          <p>
            There are {combination} combination{combination > 1 ? 's' : ''} of 2
            players for {players.length} players. This will take about{' '}
            {estimatedMinutes > 0 && (
              <>
                {estimatedMinutes} minute{estimatedMinutes > 1 && 's'}{' '}
                {estimatedSeconds && 'and'}
              </>
            )}
            {estimatedSeconds > 0 && (
              <>
                {estimatedSeconds} second{estimatedSeconds > 1 && 's'}
              </>
            )}
            if each choice takes a second.
          </p>
          <p>
            Current progress: {currentProgress}/{combination}
          </p>
          <div className="selections">
            <button
              onClick={select(playerAName, playerBName, 1.0)}
              type="button"
            >
              {playerAImage ? (
                <img
                  alt={playerAName}
                  height={64}
                  src={playerAImage}
                  width={64}
                />
              ) : (
                playerAName
              )}
            </button>
            <button
              onClick={select(playerAName, playerBName, 0.0)}
              type="button"
            >
              {playerBImage ? (
                <img
                  alt={playerBName}
                  height={64}
                  src={playerBImage}
                  width={64}
                />
              ) : (
                playerBName
              )}
            </button>
          </div>
          <button onClick={select(playerAName, playerBName, 0.5)} type="button">
            Draw / I Cannot Decide
          </button>
        </>
      ) : (
        <>
          <p role="alert">
            You have completed the ranker, on the next page you will have a
            chance to see and save your results. Remember, do not reload your
            browser as the ranker does not store any store any information on
            your computer.
          </p>
          <button onClick={viewResults} type="button">
            View Results
          </button>
        </>
      )}
    </>
  )
}
