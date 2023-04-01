import { type OverallStatistics } from 'js-elo-system'

export { default } from './Results'

export interface Results {
  name: string
  players: OverallStatistics
}
