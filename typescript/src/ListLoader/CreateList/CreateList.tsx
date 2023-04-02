import { useRef } from 'react'

import Button from '../../components/Button'

import { type PlayerList } from '..'

type Callback = { callback: (playerList: PlayerList) => void }

function CreateList ({ callback }: Callback): JSX.Element {
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
    <form id='new-ranker' onSubmit={createNewRanker}>
      <label htmlFor='name'>Name Of The List</label>
      <br />
      <input id='name' ref={listName} required />
      <br />
      <label htmlFor='characters'>Characters (Separated by newlines)</label>
      <br />
      <textarea id='characters' ref={characterList}
        rows={5} cols={30} required
      />
      <br />
      <Button type='submit'>Create Ranker</Button>
    </form>
  )
}

export default CreateList
