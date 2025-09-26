/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import { NavLink } from "react-router";
import zod from "zod";

import { SaveResults } from "~/results/save";
import { ResultsTable } from "~/results/table";
import { rankerResult } from "~/schemas";

import type { Route } from "./+types/results";

export async function clientAction({ request }: Route.ClientActionArgs) {
  const results = await request.json();
  const parsedResults = rankerResult.safeParse(results);

  if (!parsedResults.success) {
    return {
      error: zod.prettifyError(parsedResults.error),
      ok: false as const,
    };
  }

  return { data: parsedResults.data, ok: true as const };
}

export default function ShowResults({ actionData }: Route.ComponentProps) {
  if (!actionData || !actionData.ok) {
    return (
      <>
        {actionData ? (
          <div className="load-error">
            <p>Error: Unable to load ranker results</p>
            <p>{actionData.error}</p>
          </div>
        ) : (
          <p>
            Error: Unable to create ranker results. Did you accidentally
            refreshed the browser?
          </p>
        )}
        <NavLink replace to="/">
          Go back home
        </NavLink>
      </>
    );
  }

  return (
    <>
      <SaveResults {...actionData.data} />
      <ResultsTable {...actionData.data} />
      <NavLink replace to="/">
        Create new ranker
      </NavLink>
    </>
  );
}
