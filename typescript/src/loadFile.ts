import { validate } from '@hyperjump/json-schema/draft-07'

export interface PlayerList { name: string, players: string[] }

export const loadFile = async (element: HTMLInputElement): Promise<PlayerList> => {
  const infoParagraph = document.querySelector<HTMLParagraphElement>('#info')!

  if (element.files == null) {
    infoParagraph.textContent = 'Please select a file.'
    throw new Error('No file selected.')
  }

  const file = element.files[0]

  if (file.type !== 'application/json') {
    infoParagraph.textContent = `${file.name} is not a JSON file`
    throw new Error(`
      Unexpected filetype: expected filetype 'application/json', actual filetype
      '${file.type}'
    `)
  }

  const data = JSON.parse(await file.text())
  const validator = await validate('https://twopizza9621536.github.io/schema/json/players.json')
  const output = validator(data)

  if (!output.valid) {
    infoParagraph.textContent = 'FIXME: Show reason why data is invalid'
    throw new Error("Data is not type '{ name: string, players: string[] }'")
  }

  return data
}
