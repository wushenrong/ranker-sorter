import { createContext } from 'react'
import { type Players } from './hooks/useEloSystem'

export type SetPlayersCallback = (playerList: Players | undefined) => void
export const CallbackContext = createContext<SetPlayersCallback>(() => {
  return
})
