/*!
 * SPDX-FileCopyrightText: 2023 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import ProgressBar from '@ramonak/react-progress-bar'
import { useEffect, useState } from 'react'
import { useMediaQuery } from '@react-hook/media-query'
import { combinations } from 'mathjs'
import type { ReactElement } from 'react'

import useEloSystem from '../hooks/useEloSystem'

import type { PlayerList } from '../hooks/useEloSystem'
import type { RankerResults } from './results'

import styles from './ranker.module.css'

type RankerProps = {
  data: PlayerList
  callback: ({ name, players }: RankerResults) => void
}

export default function Ranker ({ data, callback }: RankerProps): ReactElement {
  const [eloSystem, calculateMatch] = useEloSystem(data)
  const [playerAIndex, setPlayerAIndex] = useState(0)
  const [playerBIndex, setPlayerBIndex] = useState(1)
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const isLightTheme = useMediaQuery('(prefers-color-scheme: light)')
  const combination = combinations(data.players.length, 2)

  useEffect(() => {
    if (currentMatchIndex === combination) {
      const results = {
        name: data.name,
        players: eloSystem.get_overall_list()
      }
      callback(results)
    }
  })

  const rankPlayers = (playerAWon: boolean, isDraw: boolean): void => {
    let winner: string
    let loser: string

    if (playerBIndex >= data.players.length - 1) {
      setPlayerAIndex(currentPlayerAIndex => currentPlayerAIndex + 1)
      setPlayerBIndex(() => playerAIndex + 1)
    }

    if (playerAWon) {
      winner = data.players[playerAIndex]
      loser = data.players[playerBIndex]
    } else {
      winner = data.players[playerBIndex]
      loser = data.players[playerAIndex]
    }

    calculateMatch({ winner, loser, draw: isDraw })

    setPlayerBIndex(currentPlayerBIndex => currentPlayerBIndex + 1)
    setCurrentMatchIndex(currentProgress => currentProgress + 1)
  }

  const onClick = (playerAWon: boolean, isDraw: boolean) => {
    return () => { rankPlayers(playerAWon, isDraw) }
  }

  const percentProgress = currentMatchIndex / combination
  const progress = Math.floor(percentProgress * 100)

  const estimateChoiceTime = 12
  const minutes = combination / estimateChoiceTime
  const seconds = Math.floor(minutes % 1 * 60)

  let estimateCompletionTime = (
    <>{Math.floor(minutes)} minutes and {seconds} seconds</>
  )

  if (seconds <= 0) {
    estimateCompletionTime = <>{Math.floor(minutes)} minutes</>
  } else if (minutes < 1) {
    estimateCompletionTime = <>{seconds} seconds</>
  }

  let progressBarColor = 'rgba(255, 255, 255, 87%)'
  let barColor = '#1a1a1a'
  let labelColor = '#242424'

  if (isLightTheme) {
    progressBarColor = '#213547'
    barColor = '#f9f9f9'
    labelColor = '#fff'
  }

  return (
    <>
      <p>
        There are {combination} combinations of 2 characters
        for {data.players.length} characters.
        <br />
        This will take you about {estimateCompletionTime} if each choice takes
        about {60 / estimateChoiceTime} seconds.
      </p>

      <p className={styles.progressBarLabel}>Ranking Completion</p>
      <ProgressBar
        completed={progress}
        customLabel={`${progress}%`}
        height='1.5em'
        baseBgColor={barColor}
        bgColor={progressBarColor}
        labelColor={labelColor}
      />

      <div className={styles.selections}>
        <button type='button' onClick={onClick(true, false)}>
          {
            data.images != null
              ? (<img
                  src={data.images[playerAIndex]}
                  alt={data.players[playerAIndex]}
                  referrerPolicy='no-referrer'
                />)
              : data.players[playerAIndex]
          }
        </button>
        <button type='button' onClick={onClick(false, true)}>
          Both are equal
        </button>
        <button type='button' onClick={onClick(false, false)}>
          {
            data.images != null
              ? (<img
                  src={data.images[playerBIndex]}
                  alt={data.players[playerBIndex]}
                  referrerPolicy='no-referrer'
                />)
              : data.players[playerBIndex]
          }
        </button>
      </div>
    </>
  )
}
