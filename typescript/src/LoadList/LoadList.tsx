/*! SPDX-FileCopyrightText: 2023 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import { Suspense, lazy, useState } from 'react'
import { Draft07 } from 'json-schema-library'

import Loading from '../Loading'
import schema from '../assets/players.json'

import type { PlayerList } from '../hooks/useEloSystem'

import styles from './LoadList.module.css'

type Callback = { callback: (playerList: PlayerList) => void }
type InputEvent = React.ChangeEvent<HTMLInputElement>

const CreateList = lazy(async () => await import('./CreateList'))

function LoadList ({ callback }: Callback): JSX.Element {
  const [error, setError] = useState<JSX.Element>()
  const [isNew, setIsNew] = useState(false)

  const loadFile = async (e: InputEvent): Promise<void> => {
    if (e.target.files == null) {
      setError(<p>Please select a JSON file.</p>)
      return
    }

    const file = e.target.files[0]
    const validator = new Draft07(schema)

    if (file.type !== 'application/json') {
      setError(
        <p>
          The file you selected ({file.name}) is not a JSON file, please select
          a JSON file.
        </p>
      )
      return
    }

    const data = JSON.parse(await file.text())
    const output = validator.validate(data)

    if (output.length > 0) {
      setError(
        <p>
          The JSON file you selected has the wrong data structure, please fix
          the error before you reselect the JSON file:
          <br />
          {output[0].message}
        </p>
      )
      return
    }

    if (data.images !== undefined &&
      data.players.length !== data.images.length) {
      setError(
        <p>
          The number of images you have provided does not match up with the
          number of players, please provide an image for each player.
        </p>
      )
    }
    callback(data)
  }

  const goBack = (): void => { setIsNew(false) }

  if (isNew) {
    return (
      <Suspense fallback={<Loading />}>
        <CreateList goBack={goBack} callback={callback} />
      </Suspense>
    )
  }

  let info = (
    <p>
      To start ranking characters, either create a new list with the
      names of the characters or load a JSON file containing name and
      players.
      <br />
      The JSON may optionally include a list of urls for images.
    </p>
  )

  if (error !== undefined) info = error

  return (
    <>
      {info}
      <div className='list-selection'>
        <button type='button' onClick={() => { setIsNew(true) }}>
          New List
        </button>
        <label htmlFor='load' className={styles.loadLabel}>Load List</label>
      </div>
      <input
        type='file' id='load' onChange={(e) => { void loadFile(e) }}
        accept='application/json' className={styles.load}
      />
    </>
  )
}

export default LoadList
