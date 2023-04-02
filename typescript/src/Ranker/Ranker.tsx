import { useEffect, useMemo, useState } from 'react'
import { combinations } from 'mathjs'

import { useEloSystem } from './useEloSystem'
import { type PlayerList } from '../ListLoader'
import type { RankerResults } from '../Results'

type RankerProps = {
  data: PlayerList
  callback: ({ name, players }: RankerResults) => void
}

function Ranker ({ data, callback }: RankerProps): JSX.Element {
  const [eloSystem, calculateMatch] = useEloSystem(data)
  const [playerAIndex, setPlayerAIndex] = useState(0)
  const [playerBIndex, setPlayerBIndex] = useState(1)
  const comb = useMemo(() => combinations(data.players.length, 2), [data])

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
      setPlayerAIndex(playerAIndex => playerAIndex + 1)
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

    setPlayerBIndex(playerBIndex => playerBIndex + 1)
  }

  const onClick = (playerAWon: boolean, isDraw: boolean) =>
    () => { rankPlayers(playerAWon, isDraw) }

  return (
    <>
      <p>
        There are {comb} combinations of 2 players for {data.players.length}
        players.
        <br />
        This will take you about {comb / 6} minutes if each choice takes about
        10 seconds.
      </p>
      <button type='button' onClick={onClick(true, false)}>
        {data.players[playerAIndex]}
      </button>
      <button type='button' onClick={onClick(false, true)}>
        Both are equal
      </button>
      <button type='button' onClick={onClick(false, false)}>
        {data.players[playerBIndex]}
      </button>
    </>
  )
}

export default Ranker
