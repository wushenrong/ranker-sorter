import { combinations } from 'mathjs/number'
import { useState } from 'react'
import { useSubmit } from 'react-router-dom'

import { useRankerStore } from '../app/store'
import Button from '../components/Button'
import IconImage from '../components/IconImage'
import { type MatchRecord, useRanker } from '../hooks/useRanker'
import styles from '../styles/Ranker.module.css'

function Ranker() {
  const characters = useRankerStore((state) => state.characters)
  const [state, recordMatch] = useRanker(characters)

  const [playerAIndex, setPlayerAIndex] = useState(0)
  const [playerBIndex, setPlayerBIndex] = useState(1)
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0)
  const submit = useSubmit()

  if (characters.length === 0) {
    throw new Error(
      'No ranker loaded. Did you accidentally refreshed the Browser?',
    )
  }

  const combination = combinations(characters.length, 2)

  const onClick = (record: MatchRecord) => () => {
    if (playerBIndex >= characters.length - 1) {
      setPlayerAIndex((currentPlayerAIndex) => currentPlayerAIndex + 1)
      setPlayerBIndex(() => playerAIndex + 1)
    }

    recordMatch(record)

    setPlayerBIndex((currentPlayerBIndex) => currentPlayerBIndex + 1)
    setCurrentMatchIndex((currentProgress) => currentProgress + 1)
  }

  const onSubmit = () => {
    submit(
      JSON.stringify(state),
      { action: '/results', encType: 'application/json', method: 'post' },
    )
  }

  if (currentMatchIndex === combination) {
    return (
      <>
        <p role="alert">
          You have completed the ranker, on the next page you will have the
          chance to see and save your results.
          <br />
          Remember, do not reload your browser as the ranker does not store any
          store any information on your computer.
        </p>
        <Button onClick={onSubmit} type="submit">
          View Results
        </Button>
      </>
    )
  }

  const playerAName = characters[playerAIndex].name
  const playerBName = characters[playerBIndex].name
  const playerAImage = characters[playerAIndex].image
  const playerBImage = characters[playerBIndex].image
  const estimatedTime = Math.ceil(combination / 60)

  return (
    <>
      <p>
        There are
        {' '}
        {combination}
        {' '}
        combination
        {combination > 1 ? 's' : ''}
        {' '}
        of 2 characters for
        {' '}
        {characters.length}
        .
        <br />
        This will take about
        {' '}
        {estimatedTime}
        {' '}
        minute
        {estimatedTime > 1 ? 's' : ''}
        {' '}
        if each choice takes a second.
      </p>

      <p>
        Current Progress:
        {' '}
        {currentMatchIndex}
        {' '}
        /
        {' '}
        {combination}
      </p>

      <div className={styles.selections}>
        <Button
          className={styles.selection}
          onClick={onClick({
            player_a: playerAName,
            player_b: playerBName,
            winner: playerAName,
          })}
          type="button"
        >
          {
            playerAImage == undefined
              ? playerAName
              : <IconImage alt={playerAName} src={playerAImage} />
          }
        </Button>
        <Button
          className={styles.selection}
          onClick={onClick({
            player_a: playerAName,
            player_b: playerBName,
            winner: playerBName,
          })}
          type="button"
        >
          {
            playerBImage == undefined
              ? playerBName
              : <IconImage alt={playerBName} src={playerBImage} />
          }
        </Button>
      </div>

      <Button
        onClick={onClick({
          player_a: playerAName,
          player_b: playerBName,
        })}
        type="button"
      >
        Draw / No Preference
      </Button>
    </>
  )
}

export default Ranker
