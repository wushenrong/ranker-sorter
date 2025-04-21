import * as zod from '@zod/mini'
import { ActionFunctionArgs } from 'react-router'

import { shuffleArray } from './elosystem'
import { creationForm, customRanker, rankerResults } from './schemas'

export async function rankerAction({ request }: ActionFunctionArgs) {
  const formData = Object.fromEntries(await request.formData())
  const formResult = creationForm.safeParse(formData)

  if (!formResult.success) {
    return { error: zod.prettifyError(formResult.error), ok: false as const }
  }

  const rankerData = JSON.parse(await formResult.data['custom-ranker'].text())
  const result = customRanker.safeParse(rankerData)

  if (!result.success) {
    return { error: zod.prettifyError(result.error), ok: false as const }
  }

  const data = {
    players: shuffleArray(result.data.players),
    title: result.data.title,
  }

  return { data, ok: true as const }
}

export async function resultsAction({ request }: ActionFunctionArgs) {
  const rankerResultsData = await request.json()
  const result = rankerResults.safeParse(rankerResultsData)

  if (!result.success) {
    return { error: zod.prettifyError(result.error), ok: false as const }
  }

  return { data: result.data, ok: true as const }
}
