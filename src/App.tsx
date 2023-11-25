import { useState } from 'react'
import RankCreator from './components/RankCreator'
import Ranker from './components/Ranker'
import { type Players } from './hooks/useEloSystem'
import { type SetPlayersCallback, CallbackContext } from './context'
import './App.css'

function App() {
  const [players, setPlayerList] = useState<Players>()

  const setPlayers: SetPlayersCallback = (playerList) => {
    setPlayerList(playerList)
  }

  if (players) {
    return (
      <CallbackContext.Provider value={setPlayers}>
        <Ranker data={players} />
      </CallbackContext.Provider>
    )
  }

  return (
    <CallbackContext.Provider value={setPlayers}>
      <RankCreator />
    </CallbackContext.Provider>
  )
}

export default App
