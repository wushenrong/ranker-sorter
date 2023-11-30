import { useState } from 'react'
import './App.css'
import RankCreator from './components/RankCreator'
import Ranker from './components/Ranker'
import { CallbackContext, type SetPlayersCallback } from './context'
import { type Players } from './hooks/useEloSystem'

function App() {
  const [players, setPlayerList] = useState<Players>()

  const setPlayers: SetPlayersCallback = (playerList) => {
    setPlayerList(playerList)
  }

  return (
    <CallbackContext.Provider value={setPlayers}>
      {players ? <Ranker data={players} /> : <RankCreator />}
    </CallbackContext.Provider>
  )
}

export default App
