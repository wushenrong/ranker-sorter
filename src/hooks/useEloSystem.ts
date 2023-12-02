/**
 * SPDX-FileCopyrightText: 2023 Samuel Wu
 *
 * SPDX-License-Identifier: MIT
 */

import EloSystem, { type MatchRecord } from 'js-elo-system'
import { useDebugValue, useEffect, useState } from 'react'

interface Player {
  name: string
  image?: string
}

export interface Players {
  title: string
  players: Player[]
}

type RecordMatch = ({ winner, loser, draw }: MatchRecord) => void
type EloSystemHook = [EloSystem, RecordMatch]

function useEloSystem(data: Players): EloSystemHook {
  const [eloSystem, setEloSystem] = useState(new EloSystem())

  useEffect(() => {
    data.players.forEach((player) => {
      eloSystem.add_player(player.name)
    })
    setEloSystem(eloSystem)
  }, [eloSystem, data])

  useDebugValue(eloSystem ?? 'loading...')

  const calculateMatch = (match: MatchRecord) => {
    eloSystem.record_match(match)
    setEloSystem(eloSystem)
  }

  return [eloSystem, calculateMatch]
}

export default useEloSystem
