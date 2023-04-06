import { useRef } from 'react'

import classes from './CreateList.module.css'

import { type PlayerList } from '..'

type CreateListProp = {
  goBack: () => void
  callback: (playerList: PlayerList) => void
}

function CreateList ({ goBack, callback }: CreateListProp): JSX.Element {
  const listName = useRef<HTMLInputElement>(null)
  const characterList = useRef<HTMLTextAreaElement>(null)

  const createNewRanker = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault()
    const data = {
      name: listName.current!.value,
      players: characterList.current!.value.split('\n')
    }
    callback(data)
  }

  return (
    <form id='new-ranker' onSubmit={createNewRanker}
      className={classes.newRankerForm}>
      <div>
        <label htmlFor='name'>Name Of The List</label>
        <br />
        <input id='name' ref={listName} required />
      </div>
      <div>
        <label htmlFor='characters'>Characters (Separated by newlines)</label>
        <br />
        <textarea id='characters' ref={characterList}
          rows={5} cols={30} required
        />
      </div>
      <div className='selections'>
        <button type='button' onClick={goBack}>Back</button>
        <button type='submit'>Create Ranker</button>
      </div>
    </form>
  )
}

export default CreateList
