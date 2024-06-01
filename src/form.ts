import { ValidationError, fromZodError } from 'zod-validation-error'

import { setupRanker } from './ranker'
import { zodFormData, zodRankerCreationData } from './schemas'

function fileFormSetup(): Node[] {
  const legend = document.createElement('legend')
  const label = document.createElement('label')
  const input = document.createElement('input')

  legend.textContent = 'Ranker data from JSON file'

  label.textContent = 'Choose a JSON file:'
  label.htmlFor = 'get-file'

  input.id = 'get-file'
  input.name = 'file'
  input.type = 'file'
  input.accept = 'application/json'
  input.required = true

  return [legend, label, input]
}

function manualFormSetup(): Node[] {
  const legend = document.createElement('legend')
  const titleLabel = document.createElement('label')
  const titleInput = document.createElement('input')
  const charactersLabel = document.createElement('label')
  const charactersTextArea = document.createElement('textarea')

  legend.textContent = 'Custom Ranker Creation'

  titleLabel.textContent = 'Title of Ranker'
  titleLabel.htmlFor = 'title'

  titleInput.id = 'title'
  titleInput.name = 'title'
  titleInput.type = 'text'
  titleInput.minLength = 1
  titleInput.value = 'Custom Ranker'
  titleInput.required = true

  charactersLabel.textContent = 'List of Characters'
  charactersLabel.htmlFor = 'characters'

  charactersTextArea.id = 'characters'
  charactersTextArea.name = 'characters'
  charactersTextArea.minLength = 3
  charactersTextArea.placeholder = 'Names separated by newlines'
  charactersTextArea.required = true

  return [legend, titleLabel, titleInput, charactersLabel, charactersTextArea]
}

export function setupForm(formElement: HTMLFormElement, rankerForm: HTMLFieldSetElement) {
  const formTypeInputs = formElement.querySelectorAll<HTMLInputElement>('[name="type"]')
  const fileForm = fileFormSetup()
  const manualForm = manualFormSetup()

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

    setupRanker(parsedRankerData.data)
  }

  const formTypeChangeListener = (event: Event) => {
    const checkedType = event.target as HTMLInputElement

    if (checkedType.value === 'manual') {
      rankerForm.replaceChildren(...manualForm)
    } else if (checkedType.value === 'json') {
      rankerForm.replaceChildren(...fileForm)
    } else {
      setFormError(new Error('Please reload the page.'))
    }
  }

  const formSubmitListener = (event: SubmitEvent) => {
    event.preventDefault()
    getFormData().catch((error: Error) => setFormError(error))
  }

  for (const formTypeInput of formTypeInputs) {
    formTypeInput.addEventListener('change', formTypeChangeListener)
  }

  formElement.addEventListener('submit', formSubmitListener)

  rankerForm.replaceChildren(...fileForm)
}
