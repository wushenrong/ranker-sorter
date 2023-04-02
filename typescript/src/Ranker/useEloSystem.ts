import { useEffect, useState } from 'react'
import EloSystem, { type MatchRecord } from 'js-elo-system'
import { type PlayerList } from '../ListLoader'

type RecordMatch = ({ winner, loser, draw }: MatchRecord) => void
type EloSystemHook = [EloSystem, (RecordMatch)]

export function useEloSystem (data: PlayerList): EloSystemHook {
  const [eloSystem, setEloSystem] = useState(new EloSystem())

  useEffect(() => {
    data.players.forEach(player => { eloSystem.add_player(player) })
    setEloSystem(eloSystem)
  }, [])

  function calculateMatch ({ winner, loser, draw }: MatchRecord): void {
    eloSystem.record_match({ winner, loser, draw })
    setEloSystem(eloSystem)
  }

  return [eloSystem, calculateMatch]
}
