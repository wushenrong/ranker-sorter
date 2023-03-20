import EloSystem from './elo_system'

interface PlayerList { name: string, players: string[] }

export default class Container {
  name: string
  players: string[]
  elo: EloSystem
  index_i = 0
  index_j = 1

  constructor (obj: PlayerList) {
    this.name = obj.name
    this.players = obj.players
    this.elo = new EloSystem()

    this.players.forEach(element => { this.elo.add_player(element) })
  }
}
