import { z } from 'zod'

const character = z.object({
  image: z.string().url().startsWith('https://').optional(),
  name: z.string().min(1),
})

const player = z.object({
  draws: z.number(),
  elo: z.number(),
  losses: z.number(),
  wins: z.number(),
})

const namedPlayer = z.intersection(character, player)

export const result = z.object({
  players: z.array(namedPlayer),
  title: z.string(),
})

export const eloSystem = z.record(z.string(), player)

export const globalState = z.object({
  characters: z.array(character).min(
    2,
    {
      message: 'Must have 2 character(s)',
    }),
  title: z.string().min(1),
})

export type Player = z.infer<typeof player>
export type Character = z.infer<typeof character>
export type NamedPlayer = z.infer<typeof namedPlayer>
export type GlobalState = z.infer<typeof globalState>

export const formData = z.discriminatedUnion(
  'type',
  [
    z.object({
      characters: z.string(),
      title: z.string(),
      type: z.literal('manual'),
    }),
    z.object({
      file: z.instanceof(File),
      type: z.literal('json'),
    }),
  ],
)
