/*! SPDX-FileCopyrightText: 2023 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import { useEffect, useState } from 'react'
import EloSystem, { type MatchRecord } from 'js-elo-system'

export type PlayerList = { name: string, players: string[], images?: string[] }

type RecordMatch = ({ winner, loser, draw }: MatchRecord) => void
type EloSystemHook = [EloSystem, (RecordMatch)]

export default function useEloSystem (data: PlayerList): EloSystemHook {
  const [eloSystem, setEloSystem] = useState(new EloSystem())

  useEffect(() => {
    data.players.forEach(player => { eloSystem.add_player(player) })
    setEloSystem(() => eloSystem)
  }, [eloSystem, data])

  const calculateMatch = ({ winner, loser, draw }: MatchRecord): void => {
    eloSystem.record_match({ winner, loser, draw })
    setEloSystem(eloSystem)
  }

  return [eloSystem, calculateMatch]
}
