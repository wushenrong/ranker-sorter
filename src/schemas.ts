import { z } from 'zod'

const zodCharacter = z.object({
  image: z.string().url().startsWith('https://', { message: 'Image link must use https' }).optional(),
  name: z.string().min(1, { message: 'Character name must be 1 or more characters long' }),
})

const zodPlayer = z.object({
  draws: z.number(),
  elo: z.number(),
  losses: z.number(),
  wins: z.number(),
})

const zodEloSystem = z.record(z.string(), zodPlayer)

const zodRankerResults = z.object({
  characters: z.array(z.intersection(zodCharacter, zodPlayer)),
  initial_elo: z.number().min(100).max(10_000).default(1000),
  k_value: z.number().min(1).max(100).default(24),
  title: z.string(),
})

export const zodRankerCreationData = z.object({
  characters: z.array(zodCharacter).min(2, { message: 'Must have 2 character(s)' }),
  initial_elo: z.number().min(100).max(10_000).default(1000),
  k_value: z.number().min(1).max(100).default(24),
  title: z.string().min(1),
})

export const zodFormData = z.discriminatedUnion(
  'type',
  [
    z.object({
      characters: z.string(),
      initial_elo: z.string().optional(),
      k_value: z.string().optional(),
      title: z.string(),
      type: z.literal('manual'),
    }),
    z.object({
      file: z.instanceof(File),
      initial_elo: z.string().optional(),
      k_value: z.string().optional(),
      type: z.literal('json'),
    }),
  ],
)

export type EloSystem = z.infer<typeof zodEloSystem>
export type RankerResults = z.infer<typeof zodRankerResults>
export type RankerCreationData = z.infer<typeof zodRankerCreationData>
