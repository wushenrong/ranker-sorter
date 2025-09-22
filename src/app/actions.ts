import { Combination } from "js-combinatorics";
import type { ActionFunctionArgs } from "react-router";
import * as zod from "zod/mini";

import type { EloSystem } from "./elosystem";
import { DEFAULT_RATINGS, shuffleArray } from "./elosystem";
import { creationForm, customRanker, results } from "./schemas";

export async function rankerAction({ request }: ActionFunctionArgs) {
  const formData = Object.fromEntries(await request.formData());
  const formResult = creationForm.safeParse(formData);

  if (!formResult.success) {
    return { error: zod.prettifyError(formResult.error), ok: false as const };
  }

  const rankerData = JSON.parse(await formResult.data["custom-ranker"].text());
  const result = customRanker.safeParse(rankerData);

  if (!result.success) {
    return { error: zod.prettifyError(result.error), ok: false as const };
  }

  const names = result.data.players.map((player) => player.name);
  const combinations = [...new Combination(names, 2)];

  for (const combination of combinations) {
    if (Math.random() < 0.5) {
      [combination[0], combination[1]] = [combination[1], combination[0]];
    }
  }

  const system: EloSystem = {};

  for (const player of result.data.players) {
    system[player.name] = { ...DEFAULT_RATINGS, image: player.image };
  }

  const data = {
    matches: shuffleArray(combinations),
    system,
    title: result.data.title,
  };

  return { data, ok: true as const };
}

export async function resultsAction({ request }: ActionFunctionArgs) {
  const rankerResultsData = await request.json();
  const result = results.safeParse(rankerResultsData);

  if (!result.success) {
    return { error: zod.prettifyError(result.error), ok: false as const };
  }

  return { data: result.data, ok: true as const };
}
