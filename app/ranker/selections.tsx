/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import { useState } from "react";
import { useNavigation, useSubmit } from "react-router";

import type { EloSystem, Score } from "~/elosystem";
import { recordMatch } from "~/elosystem";
import type { PlayerResult } from "~/schemas";

import { Image } from "../components/image";

type RankerSelectionsProps = {
  matches: readonly string[][];
  system: EloSystem;
  title: string;
};

export function RankerSelections({
  matches,
  system,
  title,
}: RankerSelectionsProps) {
  const submit = useSubmit();
  const navigation = useNavigation();
  const isSubmitting = Boolean(navigation.location);

  const [ratings, setRatings] = useState(system);
  const [currentProgress, setCurrentProgress] = useState(0);

  const selectWinner = (playerA: string, playerB: string, score: Score) => {
    return () => {
      setRatings(recordMatch(ratings, playerA, playerB, score));
      setCurrentProgress((count) => count + 1);
    };
  };

  const viewResults = () => {
    // The following code was refactored by ChatGPT and GitHub Copilot.
    const results = {
      players: Object.entries(ratings)
        .map(([name, rating]) => ({
          ...rating,
          name,
        }))
        .sort((playerA, playerB) => playerB.elo - playerA.elo)
        .reduce<PlayerResult[]>((acc, player, i) => {
          const prev = acc[i - 1];
          // Get the rank of the character by elo, if two players have the same
          // elo, give them the same rank.
          const rank =
            i === 0 ? 1 : player.elo === prev.elo ? prev.rank : prev.rank + 1;

          acc.push({ ...player, rank });

          return acc;
        }, []),
      title,
    };

    submit(JSON.stringify(results), {
      action: "/results",
      encType: "application/json",
      method: "POST",
      replace: true,
    });
  };

  const combinations = matches.length;

  if (currentProgress < combinations) {
    const optionA = matches[currentProgress][0];
    const optionB = matches[currentProgress][1];
    const optionAImage = ratings[optionA].image;
    const optionBImage = ratings[optionB].image;

    return (
      <>
        <div className="selections">
          <button onClick={selectWinner(optionA, optionB, 1.0)} type="button">
            {optionAImage ? (
              <Image alt={optionA} src={optionAImage} />
            ) : (
              optionA
            )}
          </button>
          <button onClick={selectWinner(optionA, optionB, 0.0)} type="button">
            {optionBImage ? (
              <Image alt={optionB} src={optionBImage} />
            ) : (
              optionB
            )}
          </button>
        </div>
        <button onClick={selectWinner(optionA, optionB, 0.5)} type="button">
          Draw (Use as last resort)
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
      <button disabled={isSubmitting} onClick={viewResults} type="button">
        {isSubmitting ? "Please wait..." : "View Results"}
      </button>
    </>
  );
}
