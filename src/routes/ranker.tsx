/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import { combinations } from "mathjs/number";
import { useEffect, useState } from "react";
import { Link, useActionData, useSubmit } from "react-router";

import type { rankerAction } from "~/actions";
import type { EloSystem, Score } from "~/elosystem";
import { DEFAULT_RATINGS, recordMatch, round } from "~/elosystem";
import type { Player, PlayerResult } from "~/schemas";

const getPlayerName = (player: Player) =>
  typeof player !== "undefined" && typeof player !== "string"
    ? player.name
    : player;

const getPlayerImage = (player: Player) =>
  typeof player !== "undefined" && typeof player !== "string"
    ? player.image
    : undefined;

export function Ranker() {
  const actionData = useActionData<typeof rankerAction>();
  const submit = useSubmit();

  const [ratings, setRatings] = useState<EloSystem>({});
  const [currentProgress, setCurrentProgress] = useState(0);
  const [currentPlayerA, setCurrentPlayerA] = useState(0);
  const [currentPlayerB, setCurrentPlayerB] = useState(1);

  const [swap, setSwap] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const actionResponse = actionData?.ok ? actionData.data : actionData?.error;

  // The following code was refactored by ChatGPT.
  useEffect(() => {
    if (actionResponse && typeof actionResponse !== "string") {
      const system = actionResponse.players.reduce<EloSystem>((acc, player) => {
        const name = getPlayerName(player);

        acc[name] = { ...DEFAULT_RATINGS };

        return acc;
      }, {});

      setRatings(system);
    }
  }, [actionResponse]);

  if (!actionResponse || typeof actionResponse === "string") {
    return (
      <>
        {actionResponse ? (
          <div className="load-error">
            <p>Error: Unable to load ranker data</p>
            <p>{actionResponse}</p>
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

  const players = actionResponse.players;

  const selectWinner =
    (playerA: string, playerB: string, score: Score) => () => {
      const newRatings = recordMatch(ratings, playerA, playerB, score);

      setRatings(newRatings);
      setCurrentPlayerB((count) => count + 1);

      if (currentPlayerB >= players.length - 1) {
        setCurrentPlayerA((count) => count + 1);
        setCurrentPlayerB(currentPlayerA + 2);
      }

      setCurrentProgress((count) => count + 1);
      setSwap(Math.random() >= 0.5);
    };

  const viewResults = () => {
    if (isFinishing) {
      return;
    }

    setIsFinishing(true);

    // SPDX-SnippetBegin
    // SPDX-License-Identifier: MIT-0
    // SPDX-SnippetCopyrightText: Samuel Wu
    //
    // The following code was refactored by ChatGPT.
    const results = {
      players: players
        .map((player) => {
          const name = getPlayerName(player);
          const image = getPlayerImage(player);
          const rating = ratings[name];

          return {
            ...rating,
            elo: round(rating.elo / 10) * 10,
            image,
            name,
          };
        })
        .sort((playerA, playerB) => playerB.elo - playerA.elo)
        .reduce<PlayerResult[]>((acc, player, i) => {
          const prev = acc[i - 1];
          const rank =
            i === 0 ? 1 : player.elo === prev.elo ? prev.rank : i + 1;

          acc.push({ ...player, rank });

          return acc;
        }, []),
      title: actionResponse.title,
    };
    // SPDX-SnippetEnd

    submit(JSON.stringify(results), {
      action: "/results",
      encType: "application/json",
      method: "POST",
      replace: true,
    });
  };

  const combination = combinations(players.length, 2);
  const estimatedMinutes = Math.floor(combination / 60);
  const estimatedSeconds = combination % 60;
  const playerAName = getPlayerName(players[currentPlayerA]);
  const playerBName = getPlayerName(players[currentPlayerB]);
  const playerAImage = getPlayerImage(players[currentPlayerA]);
  const playerBImage = getPlayerImage(players[currentPlayerB]);

  const optionA = swap ? playerAName : playerBName;
  const optionB = optionA === playerAName ? playerBName : playerAName;
  const optionAImage = optionA === playerAName ? playerAImage : playerBImage;
  const optionBImage = optionB === playerBName ? playerBImage : playerAImage;

  return (
    <>
      {currentProgress < combination ? (
        <>
          <p>
            There are {combination} combination{combination > 1 && "s"} of 2
            players for {players.length} players. This will take about{" "}
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
            The "Draw / I Cannot Decide" button should be used as the last
            option, there is no penalty but result might be less accurate.
          </p>
          <p>
            Current progress: {currentProgress}/{combination}
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
      ) : (
        <>
          <p role="alert">
            You have completed the ranker, on the next page you will have a
            chance to view and save your results. Remember, do not reload your
            browser as the ranker does not store any information on your
            computer.
          </p>
          <button disabled={isFinishing} onClick={viewResults} type="button">
            {isFinishing ? "Please wait..." : "View Results"}
          </button>
        </>
      )}
    </>
  );
}
