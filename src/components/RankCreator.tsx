/**
 * SPDX-FileCopyrightText: 2023 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import { Draft07, type JsonSchema } from 'json-schema-library'
import { ReactElement, useContext, useRef, useState } from 'react'
import { CallbackContext } from '../context'
import { Players } from '../hooks/useEloSystem'

const schemaURL = 'https://twopizza9621536.github.io/schema/json/players.json'

const parseJSON = async (file: File) => {
  try {
    return JSON.parse(await file.text()) as Players
  } catch {
    return
  }
}

function RankCreator() {
  const [error, setError] = useState<ReactElement>()
  const listTitle = useRef<HTMLInputElement>(null)
  const names = useRef<HTMLTextAreaElement>(null)
  const callback = useContext(CallbackContext)

  const loadList = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    const schema = await fetch(schemaURL)
    const validator: Draft07 = new Draft07((await schema.json()) as JsonSchema)
    const data = await parseJSON(file)

    if (!data) {
      setError(
        <p>
          The file you selected is either not a JSON file or the JSON file is
          malformed, please select another file.
        </p>
      )
      return
    }

    const errors = validator.validate(data)

    if (errors.length) {
      setError(
        <p>
          The JSON file you selected has the wrong data structure, please fix
          the error before you reselect the JSON file (# being the root json
          object):
          <br />
          {errors[0].message}
        </p>
      )
      return
    }

    callback(data)
  }

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    void loadList(e)
    return
  }

  const createList = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const characters = names.current!.value.split('\n')
    const players = [
      ...new Set(
        characters.map((player) => ({
          name: player,
        }))
      ),
    ]

    if (players.length < 2) {
      setError(
        <p>Please enter two or more unique names to create a ranking.</p>
      )
      return
    }

    callback({ title: listTitle.current!.value, players })
  }

  return (
    <>
      <form autoComplete='off' className='form' onSubmit={createList}>
        <div>
          <label htmlFor='title'>Title of the list</label>
          <br />
          <input id='title' type='text' ref={listTitle} required />
        </div>
        <div>
          <label htmlFor='characters'>
            Characters
            <br />
            (Separated by newlines. Duplicate characters are removed.)
          </label>
          <br />
          <textarea
            id='characters'
            cols={30}
            rows={10}
            ref={names}
            required
          ></textarea>
        </div>
        {error}
        <div>
          <label htmlFor='load'>Load List</label>
          <button type='submit'>Create Ranker</button>
        </div>
        <input
          type='file'
          id='load'
          accept='application/json'
          onChange={onChange}
        />
      </form>
    </>
  )
}

export default RankCreator
