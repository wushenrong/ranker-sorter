/*! SPDX-FileCopyrightText: 2023 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import { useRef } from 'react'

import type { PlayerList } from '../hooks/useEloSystem'

import styles from './create-list.module.css'

type CreateListProp = {
  goBack: () => void
  callback: (playerList: PlayerList) => void
}

export default function CreateList ({ goBack, callback }: CreateListProp): JSX.Element {
  const listName = useRef<HTMLInputElement>(null)
  const characterList = useRef<HTMLTextAreaElement>(null)

  const createNewRanker = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()

    const inputList =
      (characterList.current as HTMLTextAreaElement).value.split('\n')

    const noDuplicatesList: string[] = []

    for (const character of inputList) {
      let isDuplicate = false

      for (const existingCharacter of noDuplicatesList) {
        if (character === existingCharacter) isDuplicate = true
      }

      if (!isDuplicate) noDuplicatesList.push(character)
    }

    const data = {
      name: (listName.current as HTMLInputElement).value,
      players: noDuplicatesList
    }
    callback(data)
  }

  return (
    <form
      id='new-ranker'
      onSubmit={createNewRanker}
      className={styles.newRankerForm}
      autoComplete='off'
    >
      <div>
        <label htmlFor='name'>Name Of The List</label>
        <br />
        <input id='name' ref={listName} required />
      </div>

      <div>
        <label htmlFor='characters'>
          Characters
          <br />
          (Separated by newlines, duplicate characters are removed)
        </label>
        <br />
        <textarea
          id='characters'
          className={styles.characters}
          ref={characterList}
          rows={5}
          cols={30}
          required
        />
      </div>

      <div className='selections'>
        <button type='button' onClick={goBack}>Back</button>
        <button type='submit'>Create Ranker</button>
      </div>
    </form>
  )
}
