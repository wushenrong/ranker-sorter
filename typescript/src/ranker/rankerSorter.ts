import EloSystem from 'elo-system'

interface PlayerList { name: string, players: string[] }

export default class RankerSorter {
  name: string
  players: string[]
  elo_system: EloSystem
  index_i = 0
  index_j = 1

  constructor (obj: PlayerList) {
    this.name = obj.name
    this.players = obj.players
    this.elo_system = new EloSystem()

    this.players.forEach(element => { this.elo_system.add_player(element) })
  }
}
