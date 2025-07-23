/*
 * SPDX-FileCopyrightText: 2025 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import * as zod from "zod/mini";

zod.config(zod.core.locales.en());

const player = zod.object({
  image: zod.optional(
    zod.url("Must be an URL").check(
      zod.regex(/^https:\/\//, "Must use HTTPS"),
      zod.regex(
        /[-_a-zA-Z0-9.]{2,256}\.[a-z]{2,4}\b(\/[-_a-zA-Z0-9./]*)/,
        "Must be a website",
      ),
      zod.regex(/([-_a-zA-Z0-9]+)\.(png|jp(e)?g)$/, {
        error: "Must be pointing to a PNG or JPEG file",
      }),
    ),
  ),
  name: zod
    .string()
    .check(zod.minLength(1, "Must be 1 or more characters long")),
});

const ratings = zod.object({
  draws: zod.number().check(zod.gte(0)),
  elo: zod.number().check(zod.gte(0)),
  losses: zod.number().check(zod.gte(0)),
  wins: zod.number().check(zod.gte(0)),
});

export const customRanker = zod.object({
  players: zod
    .array(
      zod.union([
        zod
          .string()
          .check(zod.minLength(1, "Name must be 1 or more characters long")),
        player,
      ]),
    )
    .check(zod.minLength(2, "Must have 2 or more players")),
  title: zod
    .string()
    .check(zod.minLength(3, "Must be 3 or more characters long")),
});

const playerResult = zod.object({
  ...player.shape,
  ...ratings.shape,
  rank: zod.number().check(zod.gte(1)),
});

export const results = zod.extend(customRanker, { players: zod.array(playerResult) });

export const creationForm = zod.object({
  "custom-ranker": zod
    .file()
    .check(
      zod.minSize(1, "Must select a file"),
      zod.mime(["application/json"], "Must be a JSON file"),
    ),
});

export type Player = zod.infer<typeof player> | string;
export type Ratings = zod.infer<typeof ratings>;
export type PlayerResult = zod.infer<typeof playerResult>;
