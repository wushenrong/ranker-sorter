import { combinations } from 'mathjs/number'

import type { RankerCreationData } from './schemas'

import { addImageToElement, beforeUnloadEventListener } from './html-helpers'
import { displayResults } from './results'
import { EloSystem } from './schemas'

interface MatchRecord {
  character_a: string
  character_b: string
  winner?: string
}

const APP = document.querySelector('#app')!

export function setupRanker(data: RankerCreationData) {
  const ELO_SYSTEM: EloSystem = {}
  const combination = combinations(data.characters.length, 2)
  const estimatedTime = Math.ceil(combination / 12)

  let currentMatchIndex = 0
  let characterAIndex = 0
  let characterBIndex = 1

  for (const character of data.characters) {
    ELO_SYSTEM[character.name] = {
      draws: 0,
      elo: data.initial_elo,
      losses: 0,
      wins: 0,
    }
  }

  APP.innerHTML = `
    <p id="info">
      There are ${combination} combination${combination > 1 ? 's' : ''} of 2 characters for ${data.characters.length}
      characters.
      <br>
      This will take you about ${estimatedTime} minute${estimatedTime > 1 ? 's' : ''} if each choice takes about 5
      seconds.
    </p>
    <p id="progress-info">Current Progress: ${currentMatchIndex} / ${combination}</p>
    <div class="selections">
      <button id="character-a" type="button"></button>
      <button id="character-b" type="button"></button>
    </div>
    <button id="draw" type="button">Both are equal</button>
  `

  const progressInfo = APP.querySelector('#progress-info')!
  const characterAButton = APP.querySelector<HTMLButtonElement>('#character-a')!
  const characterBButton = APP.querySelector<HTMLButtonElement>('#character-b')!
  const drawButton = APP.querySelector<HTMLButtonElement>('#draw')!

  const rankCharacters = (record: MatchRecord) => {
    const characterAElo = ELO_SYSTEM[record.character_a].elo
    const characterBElo = ELO_SYSTEM[record.character_b].elo
    const characterARatings = 10 ** (characterAElo / 400)
    const characterBRatings = 10 ** (characterBElo / 400)
    const overallRatings = characterARatings + characterBRatings
    const characterAExpectedScore = characterARatings / overallRatings
    const characterBExpectedScore = characterBRatings / overallRatings

    let characterAScore
    let characterBScore

    if (record.winner === record.character_a) {
      characterAScore = 1
      characterBScore = 0
      ELO_SYSTEM[record.character_a].wins += 1
      ELO_SYSTEM[record.character_b].losses += 1
    } else if (record.winner === record.character_b) {
      characterAScore = 0
      characterBScore = 1
      ELO_SYSTEM[record.character_a].losses += 1
      ELO_SYSTEM[record.character_b].wins += 1
    } else {
      characterAScore = 0.5
      characterBScore = 0.5
      ELO_SYSTEM[record.character_a].draws += 1
      ELO_SYSTEM[record.character_b].draws += 1
    }

    const newCharacterAScore = characterAScore - characterAExpectedScore
    const newCharacterBScore = characterBScore - characterBExpectedScore
    const characterAEloChange = Math.floor(data.k_value * newCharacterAScore)
    const characterBEloChange = Math.floor(data.k_value * newCharacterBScore)

    ELO_SYSTEM[record.character_a].elo = Math.max(characterAElo + characterAEloChange, 0)
    ELO_SYSTEM[record.character_b].elo = Math.max(characterBElo + characterBEloChange, 0)
  }

  const viewResultsListener = () => {
    const characters = data.characters.map((character) => {
      return { ...ELO_SYSTEM[character.name], ...character }
    }).sort((character_a, character_b) => character_b.elo - character_a.elo)

    displayResults({ ...data, characters })
  }

  const onClickListener = (button: string) => () => {
    let record: MatchRecord

    if (button === 'character_a') {
      record = {
        character_a: data.characters[characterAIndex].name,
        character_b: data.characters[characterBIndex].name,
        winner: data.characters[characterAIndex].name,
      }
    } else if (button === 'character_b') {
      record = {
        character_a: data.characters[characterAIndex].name,
        character_b: data.characters[characterBIndex].name,
        winner: data.characters[characterBIndex].name,
      }
    } else {
      record = {
        character_a: data.characters[characterAIndex].name,
        character_b: data.characters[characterBIndex].name,
      }
    }

    rankCharacters(record)

    characterBIndex += 1
    currentMatchIndex += 1

    if (characterBIndex >= data.characters.length) {
      characterAIndex += 1
      characterBIndex = characterAIndex + 1
    }

    if (currentMatchIndex === combination) {
      APP.innerHTML = `
        <p role="alert">
          You have completed the ranker, on the next page you will have the chance to see and save your results.
          <br>
          Remember, do not reload your browser as the ranker does not store any information on your computer.
        </p>
        <button>View Results</button>
      `

      APP.querySelector('button')!.addEventListener('click', viewResultsListener)

      return
    }

    progressInfo.textContent = `Current Progress: ${currentMatchIndex} / ${combination}`

    addImageToElement(characterBButton, data.characters[characterBIndex].name, data.characters[characterBIndex].image)
    addImageToElement(characterAButton, data.characters[characterAIndex].name, data.characters[characterAIndex].image)
  }

  addImageToElement(characterAButton, data.characters[characterAIndex].name, data.characters[characterAIndex].image)
  addImageToElement(characterBButton, data.characters[characterBIndex].name, data.characters[characterBIndex].image)

  characterAButton.addEventListener('click', onClickListener('character_a'))
  characterBButton.addEventListener('click', onClickListener('character_b'))
  drawButton.addEventListener('click', onClickListener('draw'))

  window.addEventListener('beforeunload', beforeUnloadEventListener)
}
