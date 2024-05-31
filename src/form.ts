import { ValidationError, fromZodError } from 'zod-validation-error'

import { setupRanker } from './ranker'
import { zodFormData, zodRankerCreationData } from './schemas'

const fileForm = `
  <legend>Ranker data from JSON file</legend>
  <label for="get-file">Choose a JSON file:</label>
  <input id="get-file" name="file" type="file" accept="application/json" required>
`

const manualForm = `
  <legend>Custom Ranker Creation</legend>
  <label for="title">Title of Ranker</label>
  <input id="title" name="title" minLength="1" value="Custom Ranker" required>
  <label for="characters">List of Characters</label>
  <textarea id="characters" name="characters" minLength="3" required>Names separated by newlines</textarea>
`

export function setupForm(formElement: HTMLFormElement) {
  const formTypeInputs = formElement.querySelectorAll<HTMLInputElement>('[name="type"]')
  const rankerForm = formElement.querySelector<HTMLFieldSetElement>('#ranker-data')!

  const setFormError = (error: Error) => {
    let errorMessageBox = formElement.querySelector<HTMLParagraphElement>('#error')

    if (errorMessageBox) {
      errorMessageBox.textContent = error.message
    } else {
      errorMessageBox = document.createElement('p')
      errorMessageBox.id = 'error'
      errorMessageBox.role = 'alert'
      errorMessageBox.textContent = error.message
      rankerForm.after(errorMessageBox)
    }
  }

  const getFormData = async () => {
    const formData = Object.fromEntries(new FormData(formElement))
    const parsedFormData = zodFormData.safeParse(formData)
    let rankerData: unknown

    if (!parsedFormData.success) {
      throw fromZodError(parsedFormData.error)
    }

    const sanitizedFormData = parsedFormData.data

    if (sanitizedFormData.type === 'json') {
      if (sanitizedFormData.file.type !== 'application/json') {
        throw new ValidationError(`Validation error: ${sanitizedFormData.file.name} is not a JSON file.`)
      }

      rankerData = JSON.parse(await sanitizedFormData.file.text())
    } else if (sanitizedFormData.type === 'manual') {
      const characterList = sanitizedFormData.characters.split('\n').filter(name => name.trim() != '')

      rankerData = {
        characters: [...new Set(characterList.map(name => ({ name })))],
        title: sanitizedFormData.title,
      }
    } else {
      throw new Error('Please reload the page.')
    }

    const parsedRankerData = zodRankerCreationData.safeParse(rankerData)

    if (!parsedRankerData.success) {
      throw fromZodError(parsedRankerData.error)
    }

    return parsedRankerData.data
  }

  const formTypeChangeListener = (event: Event) => {
    const checkedType = event.target as HTMLInputElement

    if (checkedType.value === 'manual') {
      rankerForm.innerHTML = manualForm
    } else if (checkedType.value === 'json') {
      rankerForm.innerHTML = fileForm
    } else {
      setFormError(new Error('Please reload the page.'))
    }
  }

  const formSubmitListener = (event: SubmitEvent) => {
    event.preventDefault()
    getFormData().then(data => setupRanker(data)).catch((error: Error) => setFormError(error))
  }

  for (const formTypeInput of formTypeInputs) {
    formTypeInput.addEventListener('change', formTypeChangeListener)
  }

  formElement.addEventListener('submit', formSubmitListener)

  rankerForm.innerHTML = fileForm
}
