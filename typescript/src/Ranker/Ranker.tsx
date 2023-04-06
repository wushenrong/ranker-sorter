import { useEffect, useMemo, useState } from 'react'
import { combinations } from 'mathjs'

import { useEloSystem } from '../hooks/useEloSystem'
import classes from './Ranker.module.css'

import { type PlayerList } from '../LoadList'
import { type RankerResults } from '../Results'

type RankerProps = {
  data: PlayerList
  callback: ({ name, players }: RankerResults) => void
}

function Ranker ({ data, callback }: RankerProps): JSX.Element {
  const [eloSystem, calculateMatch] = useEloSystem(data)
  const [playerAIndex, setPlayerAIndex] = useState(0)
  const [playerBIndex, setPlayerBIndex] = useState(1)
  const comb = useMemo(
    () => combinations(data.players.length, 2),
    [data.players]
  )

  useEffect(() => {
    if (playerAIndex >= data.players.length - 1) {
      const results = {
        name: data.name,
        players: eloSystem.get_overall_list()
      }
      callback(results)
    }
  }, [playerBIndex])

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
  }

  const onClick = (playerAWon: boolean, isDraw: boolean) =>
    () => { rankPlayers(playerAWon, isDraw) }

  const minutes = comb / 6
  const seconds = Math.floor(minutes % 1 * 60)

  return (
    <>
      <p>
        There are {comb} combinations of 2 characters
        for {data.players.length} characters.
        <br />
        This will take you about {Math.floor(minutes)} minutes
        {seconds > 0 ? <> and {seconds} seconds</> : <></>} if each choice takes
        about 10 seconds.
      </p>
      <div className={classes.selections}>
        <button type='button' onClick={onClick(true, false)}>
          {data.images !== undefined
            ? <img
              src={data.images[playerAIndex]}
              referrerPolicy='no-referrer'
              alt={data.players[playerAIndex]}
            />
            : data.players[playerAIndex]
          }
        </button>
        <button type='button' onClick={onClick(false, true)}>
          Both are equal
        </button>
        <button type='button' onClick={onClick(false, false)}>
          {data.images !== undefined
            ? <img
              src={data.images[playerBIndex]}
              referrerPolicy='no-referrer'
              alt={data.players[playerBIndex]}
            />
            : data.players[playerBIndex]
          }
        </button>
      </div>
    </>
  )
}

export default Ranker
