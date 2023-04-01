import { validate } from '@hyperjump/json-schema/draft-07'
import { type PlayerList } from '../Ranker'

type CallbackFunction = (data: PlayerList) => void

export default function setupFileLoader (button: HTMLInputElement, callback: CallbackFunction): void {
  const loadFile = async (): Promise<void> => {
    const file = button.files![0]

    if (file.type !== 'application/json') {
      throw Error(`
        Unexpected filetype '${file.type}' from ${file.name}, expected filetype
        'application/json'
      `)
    }

    const _data = JSON.parse(await file.text())
    const _schema = 'https://twopizza9621536.github.io/schema/json/players.json'
    const _output = (await validate(_schema))(_data)

    if (!_output.valid) {
      throw Error(`
        ${file.name} does not strictly follow the data structure
        '{ name: string, players: string[] }'
      `)
    }

    callback(JSON.parse(await file.text()))
  }

  button.addEventListener('change', () => { void loadFile() })
}
