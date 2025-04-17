import * as zod from '@zod/mini'

import { combinations } from 'mathjs'
import { useEffect, useState } from 'react'
import { Link, useSubmit } from 'react-router'

import { DEFAULT_RATINGS, recordMatch } from '~/elosystem'
import { creationForm, customRanker } from '~/schema'
import { shuffleArray } from '~/utils'

import type { Route } from './+types/ranker'

import type { EloSystem, Score } from '~/elosystem'
import type { Player } from '~/schema'

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = Object.fromEntries(await request.formData())
  const formResult = creationForm.safeParse(formData)

  if (!formResult.success) {
    return { ok: false as const, error: zod.prettifyError(formResult.error) }
  }

  const rankerData = JSON.parse(await formResult.data['custom-ranker'].text())
  const result = customRanker.safeParse(rankerData)

  if (!result.success) {
    return { ok: false as const, error: zod.prettifyError(result.error) }
  }

  const data = {
    title: result.data.title,
    players: shuffleArray(result.data.players),
  }

  return { ok: true as const, data }
}

export default function Ranker({ actionData }: Route.ComponentProps) {
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
        <Link to="/" replace>
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
      title: actionData.data.title,
      players: players
        .map((player) => {
          const name = typeof player !== 'string' ? player.name : player
          const image = typeof player !== 'string' ? player.image : undefined

          return { ...ratings[name], name, image }
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
  const estimatedMinutes = Math.floor(combination / 60)
  const estimatedSeconds = combination % 60
  const playerAName = getPlayerName(players[currentPlayerA])
  const playerBName = getPlayerName(players[currentPlayerB])

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
              type="button"
              onClick={select(playerAName, playerBName, 1.0)}
            >
              {playerAName}
            </button>
            <button
              type="button"
              onClick={select(playerAName, playerBName, 0.0)}
            >
              {playerBName}
            </button>
          </div>
          <button type="button" onClick={select(playerAName, playerBName, 0.5)}>
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
          <button type="button" onClick={viewResults}>
            View Results
          </button>
        </>
      )}
    </>
  )
}
