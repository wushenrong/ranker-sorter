import { validate } from '@hyperjump/json-schema/draft-07'

import { type PlayerList } from './createRanker'

export const loadFile = async (element: HTMLInputElement): Promise<PlayerList> => {
  const _infoParagraph = document.querySelector<HTMLParagraphElement>('#info')!

  if (element.files == null) {
    _infoParagraph.textContent = 'Please select a file.'
    throw new Error('No file selected.')
  }

  const file = element.files[0]

  if (file.type !== 'application/json') {
    _infoParagraph.textContent = `${file.name} is not a JSON file`
    throw new Error(`
      Unexpected filetype: expected filetype 'application/json', actual filetype
      '${file.type}'
    `)
  }

  const _data = JSON.parse(await file.text())
  const _schema = 'https://twopizza9621536.github.io/schema/json/players.json'

  await validate(_schema)
    .then((validator) => { return validator(_data) })
    .then((output) => {
      if (!output.valid) {
        _infoParagraph.textContent = `
            The contents of the JSON file does not match the following
            structure: '{ name: string, players: string[] }'
          `
        console.log(output.errors)
        throw new Error(`
          Data is not type '{ name: string, players: string[] }'
        `)
      }
    })

  return _data
}
