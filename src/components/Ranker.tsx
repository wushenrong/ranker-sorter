import { useState } from 'react'
import useEloSystem, { type Players } from '../hooks/useEloSystem'
import { combinations } from '../utils/math'
import Result from './Result'

interface RankerProps {
  data: Players
}

interface RoundRecord {
  winner: string
  loser: string
  draw: boolean
}

function Ranker({ data }: RankerProps) {
  const [eloSystem, calculateMatch] = useEloSystem(data)
  const [playerAIndex, setPlayerAIndex] = useState(0)
  const [playerBIndex, setPlayerBIndex] = useState(playerAIndex + 1)
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const combination = combinations(data.players.length, 2)
  const estimatedTime = Math.ceil(combination / 60)

  const rankPlayers = (outcome: RoundRecord) => {
    if (playerBIndex >= data.players.length - 1) {
      setPlayerAIndex((currentPlayerAIndex) => currentPlayerAIndex + 1)
      setPlayerBIndex(() => playerAIndex + 1)
    }

    calculateMatch(outcome)

    setPlayerBIndex((currentPlayerBIndex) => currentPlayerBIndex + 1)
    setCurrentMatchIndex((currentProgress) => currentProgress + 1)
  }

  const onClick = (record: RoundRecord) => () => rankPlayers(record)

  if (currentMatchIndex === combination) {
    return (
      <Result
        data={{
          title: data.title,
          players: eloSystem.get_overall_list(),
        }}
      />
    )
  }

  return (
    <>
      <p>
        There are {combination} combinations of 2 characters for{' '}
        {data.players.length} characters.
        <br />
        This will take you about {estimatedTime} minute
        {estimatedTime > 1 ? 's' : ''} if each choice takes a second.
      </p>
      <p>
        Current Progress: {currentMatchIndex} / {combination}
      </p>
      <div>
        <button
          type='button'
          className='selection'
          onClick={onClick({
            winner: data.players[playerAIndex].name,
            loser: data.players[playerBIndex].name,
            draw: false,
          })}>
          {data.players[playerAIndex].image != null ? (
            <img
              src={data.players[playerAIndex].image}
              alt={data.players[playerAIndex].name}
              width={96}
              height={96}
              referrerPolicy='no-referrer'
            />
          ) : (
            data.players[playerAIndex].name
          )}
        </button>
        <button
          type='button'
          className='selection'
          onClick={onClick({
            winner: data.players[playerBIndex].name,
            loser: data.players[playerAIndex].name,
            draw: false,
          })}>
          {data.players[playerBIndex].image != null ? (
            <img
              src={data.players[playerBIndex].image}
              alt={data.players[playerBIndex].name}
              width={96}
              height={96}
              referrerPolicy='no-referrer'
            />
          ) : (
            data.players[playerBIndex].name
          )}
        </button>
      </div>
      <button
        type='button'
        onClick={onClick({
          winner: data.players[playerAIndex].name,
          loser: data.players[playerBIndex].name,
          draw: true,
        })}>
        Draw / No Preference
      </button>
    </>
  )
}

export default Ranker
