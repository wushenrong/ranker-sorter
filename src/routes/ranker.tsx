/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import { useState } from "react";
import { Link, useActionData, useSubmit } from "react-router";

import type { rankerAction } from "~/actions";
import type { EloSystem, Score } from "~/elosystem";
import { recordMatch, round } from "~/elosystem";
import type { PlayerResult } from "~/schemas";

export function Ranker() {
  const actionData = useActionData<typeof rankerAction>();
  const submit = useSubmit();

  const [ratings, setRatings] = useState<EloSystem>(
    actionData?.data?.system || {},
  );

  const [currentProgress, setCurrentProgress] = useState(0);
  const [isFinishing, setIsFinishing] = useState(false);

  if (!actionData?.ok) {
    return (
      <>
        {actionData?.error ? (
          <div className="load-error">
            <p>Error: Unable to load ranker data</p>
            <p>{actionData?.error}</p>
          </div>
        ) : (
          <p>
            Error: Unable to create ranker. Did you accidentally refreshed the
            browser?
          </p>
        )}
        <Link replace to="/">
          Go back home
        </Link>
      </>
    );
  }

  const selectWinner = (playerA: string, playerB: string, score: Score) => {
    return () => {
      setRatings(recordMatch(ratings, playerA, playerB, score));
      setCurrentProgress((count) => count + 1);
    };
  };

  const viewResults = () => {
    if (isFinishing) {
      return;
    }

    setIsFinishing(true);

    // The following code was refactored by ChatGPT and GitHub Copilot.
    const results = {
      players: Object.entries(ratings)
        .map(([name, rating]) => ({
          ...rating,
          elo: round(rating.elo / 10) * 10,
          name,
        }))
        .sort((playerA, playerB) => playerB.elo - playerA.elo)
        .reduce<PlayerResult[]>((acc, player, i) => {
          const prev = acc[i - 1];
          const rank =
            i === 0 ? 1 : player.elo === prev.elo ? prev.rank : i + 1;

          acc.push({ ...player, rank });

          return acc;
        }, []),
      title: actionData.data.title,
    };

    submit(JSON.stringify(results), {
      action: "/results",
      encType: "application/json",
      method: "POST",
      replace: true,
    });
  };

  const matches = actionData.data.matches;
  const combinations = actionData.data.matches.length;

  if (currentProgress < combinations) {
    const estimatedMinutes = Math.floor(combinations / 60);
    const estimatedSeconds = combinations % 60;

    const optionA = matches[currentProgress][0];
    const optionB = matches[currentProgress][1];
    const optionAImage = ratings[optionA].image;
    const optionBImage = ratings[optionB].image;

    return (
      <>
        <p>
          There are {combinations} combination{combinations > 1 && "s"} of 2{" "}
          players for {Object.keys(ratings).length} players. This will take{" "}
          about{" "}
          {estimatedMinutes > 0 && (
            <>
              {estimatedMinutes} minute{estimatedMinutes > 1 && "s"}{" "}
              {estimatedSeconds && "and"}
            </>
          )}
          {estimatedSeconds > 0 && (
            <>
              {estimatedSeconds} second{estimatedSeconds > 1 && "s"}{" "}
            </>
          )}
          if each choice takes a second.
        </p>
        <p>
          The "Draw / I Cannot Decide" button should be used as the last option,
          there is no penalty but result might be less accurate.
        </p>
        <p>
          Current progress: {currentProgress}/{combinations}
        </p>
        <div className="selections">
          <button onClick={selectWinner(optionA, optionB, 1.0)} type="button">
            {optionAImage ? (
              <img alt={optionA} height={64} src={optionAImage} width={64} />
            ) : (
              optionA
            )}
          </button>
          <button onClick={selectWinner(optionA, optionB, 0.0)} type="button">
            {optionBImage ? (
              <img alt={optionB} height={64} src={optionBImage} width={64} />
            ) : (
              optionB
            )}
          </button>
        </div>
        <button onClick={selectWinner(optionA, optionB, 0.5)} type="button">
          Draw / I Cannot Decide
        </button>
      </>
    );
  }

  return (
    <>
      <p role="alert">
        You have completed the ranker, on the next page you will have a chance
        to view and save your results. Remember, do not reload your browser as
        the ranker does not store any information on your computer.
      </p>
      <button disabled={isFinishing} onClick={viewResults} type="button">
        {isFinishing ? "Please wait..." : "View Results"}
      </button>
    </>
  );
}
