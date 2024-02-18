import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

import { GlobalState } from './schemas'

interface Actions {
  resetRanker: () => void
  setRanker: (characters: GlobalState) => void
}

const initialState: GlobalState = {
  characters: [],
  title: '',
}

export const useRankerStore = create<GlobalState & Actions>()(
  immer(
    devtools(
      (set) => ({
        ...initialState,
        resetRanker() {
          set(initialState)
        },
        setRanker(characterList: GlobalState) {
          set((state) => {
            state.title = characterList.title
            state.characters.push(...characterList.characters)
          })
        },
      }),
    ),
  ),
)
