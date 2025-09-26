/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import { Combination } from "js-combinatorics";
import { NavLink } from "react-router";
import * as zod from "zod/mini";

import { DEFAULT_RATINGS, type EloSystem, shuffleArray } from "~/elosystem";
import { RankerSelections } from "~/ranker/selections";
import { customRanker, rankerCreationForm } from "~/schemas";

import type { Route } from "./+types/ranking";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = Object.fromEntries(await request.formData());
  const parsedFormData = rankerCreationForm.safeParse(formData);

  if (!parsedFormData.success) {
    return {
      error: zod.prettifyError(parsedFormData.error),
      ok: false as const,
    };
  }

  const rankerData = JSON.parse(
    await parsedFormData.data["custom-ranker"].text(),
  );
  const parsedRankerData = customRanker.safeParse(rankerData);

  if (!parsedRankerData.success) {
    return {
      error: zod.prettifyError(parsedRankerData.error),
      ok: false as const,
    };
  }

  const names = parsedRankerData.data.players.map((player) => player.name);
  const combinations = [...new Combination(names, 2)].map((combination) =>
    Math.random() < 0.5
      ? [combination[0], combination[1]]
      : [combination[1], combination[0]],
  );

  // The following code was refactored by ChatGPT.
  const system = parsedRankerData.data.players.reduce<EloSystem>(
    (acc, player) => {
      acc[player.name] = { ...DEFAULT_RATINGS, image: player.image };

      return acc;
    },
    {},
  );

  const data = {
    matches: shuffleArray(combinations),
    system,
    title: parsedRankerData.data.title,
  };

  return { data, ok: true as const };
}

export default function Ranking({ actionData }: Route.ComponentProps) {
  if (!actionData || !actionData.ok) {
    return (
      <>
        {actionData ? (
          <div className="load-error">
            <p>Error: Unable to load ranker data</p>
            <p>{actionData.error}</p>
          </div>
        ) : (
          <p>
            Error: Unable to create ranker. Did you accidentally refreshed the
            browser?
          </p>
        )}
        <NavLink replace to="/">
          Go back home
        </NavLink>
      </>
    );
  }

  return <RankerSelections {...actionData.data} />;
}
