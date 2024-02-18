import { type ActionFunctionArgs, redirect } from 'react-router-dom'
import { fromZodError, ValidationError } from 'zod-validation-error'

import { eloSystem, formData, globalState, type NamedPlayer } from './schemas'
import { useRankerStore } from './store'

export async function createRankerAction({ request }: ActionFunctionArgs) {
  const rankerFormData = Object.fromEntries(await request.formData())
  const rankerFormResults = formData.safeParse(rankerFormData)
  let rankerData: unknown

  if (!rankerFormResults.success) {
    return fromZodError(rankerFormResults.error)
  }

  if (rankerFormResults.data.type === 'json') {
    if (rankerFormResults.data.file.type !== 'application/json') {
      return new ValidationError(
        `Validation error: ${rankerFormResults.data.file.name} is not a JSON `
        + 'file.',
      )
    }

    rankerData = JSON.parse(await rankerFormResults.data.file.text())
  } else {
    const characterList = rankerFormResults.data.characters
      .split('\n')
      .filter((name) => name.trim() != '')

    rankerData = {
      characters: [
        ...new Set(characterList.map((name) => ({ name }))),
      ],
      title: rankerFormResults.data.title,
    }
  }

  const rankerResults = globalState.safeParse(rankerData)

  if (!rankerResults.success) {
    return fromZodError(rankerResults.error)
  }

  useRankerStore.getState().resetRanker()
  useRankerStore.getState().setRanker(rankerResults.data)

  return redirect('/ranker')
}

export async function getResultsAction({ request }: ActionFunctionArgs) {
  const title = useRankerStore.getState().title
  const characters = useRankerStore.getState().characters
  const data: unknown = await request.json()

  const results = eloSystem.safeParse(data)

  if (!results.success) {
    throw fromZodError(results.error)
  }

  const players = characters.map((character): NamedPlayer => {
    return {
      ...results.data[character.name],
      image: character.image,
      name: character.name,
    } satisfies NamedPlayer
  }).sort((player_a, player_b) => player_b.elo - player_a.elo)

  return { players, title }
}
