/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import type { RankerResult as RankerResultProps } from "~/schemas";

import { Image } from "../components/image";

const TABLE_HEADINGS = [
  "Player",
  "Rank",
  "Elo",
  "Wins",
  "Losses",
  "Draws",
] as const;

export function ResultsTable({ title, players }: RankerResultProps) {
  return (
    <table>
      <caption>Result of ranking {title}</caption>
      <thead>
        <tr>
          {TABLE_HEADINGS.map((heading) => (
            <th key={heading} scope="col">
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {players.map((player) => (
          <tr key={player.name}>
            <th scope="row">
              {player.image ? (
                <Image alt={player.name} src={player.image} />
              ) : (
                player.name
              )}
            </th>
            <td>{player.rank}</td>
            <td>{player.elo}</td>
            <td>{player.wins}</td>
            <td>{player.losses}</td>
            <td>{player.draws}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
