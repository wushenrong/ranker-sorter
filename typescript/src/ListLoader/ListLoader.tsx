import type React from 'react'
import { useState } from 'react'
import { Draft07 } from 'json-schema-library'

import { type PlayerList } from '.'
import schema from './players.json'
import CreateList from './CreateList/CreateList'

type Callback = { callback: (playerList: PlayerList) => void }
type InputEvent = React.ChangeEvent<HTMLInputElement>

function ListLoader ({ callback }: Callback): JSX.Element {
  const [error, setError] = useState({ message: '', validatorError: '' })
  const [isNew, setIsNew] = useState(false)

  const loadFile = async (e: InputEvent): Promise<void> => {
    const file = e.target.files![0]
    const validator = new Draft07(schema)

    if (file.type !== 'application/json') {
      setError({
        message: `
          The file you selected ({file.name}) is not a JSON file, please select
          a JSON file.
        `,
        validatorError: ''
      })
      return
    }

    const data = JSON.parse(await file.text())
    const output = validator.validate(data)

    if (output.length > 0) {
      setError({
        message: `
          The JSON file you selected has the wrong data structure, please fix
          the error before you reselect the JSON file:
        `,
        validatorError: output[0].message
      })
      return
    }

    callback(data)
  }

  let info
  if (error.message.length > 0) {
    info = <p>
      {error.message}
      {
        error.validatorError.length > 0
          ? <><br />{error.validatorError}</>
          : <></>
      }
    </p>
  } else {
    info = <p>
      To start ranking characters, either create a new list with the
      names of the characters or load a JSON file containing the name of
      the list and a list of characters.
    </p>
  }

  if (isNew) {
    return <CreateList />
  }

  return (
    <>
      {info}
      <button type='button' onChange={() => { setIsNew(true) }}>
        New List
      </button>
      <button type='button'><label htmlFor='load'>Load List</label></button>
      <input
        type='file'
        id='load'
        accept='application/json'
        onChange={(e) => { void loadFile(e) }}
      />
    </>
  )
}

export default ListLoader
