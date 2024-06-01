import { setupForm } from './form'
import { APP } from './html-helpers'
import './index.css'

function setupFormTypeFieldset() {
  const fieldset = document.createElement('fieldset')
  const legend = document.createElement('legend')
  const jsonRadioInput = document.createElement('input')
  const jsonRadioInputLabel = document.createElement('label')
  const manualRadioInput = document.createElement('input')
  const manualRadioInputLabel = document.createElement('label')

  legend.textContent = 'Please select how the ranker will be created'

  jsonRadioInput.id = 'json-file-form'
  jsonRadioInput.name = 'type'
  jsonRadioInput.type = 'radio'
  jsonRadioInput.value = 'json'
  jsonRadioInput.required = true
  jsonRadioInput.checked = true

  jsonRadioInputLabel.textContent = 'JSON File'
  jsonRadioInputLabel.htmlFor = 'json-file-form'

  manualRadioInput.id = 'manual-creation-form'
  manualRadioInput.name = 'type'
  manualRadioInput.type = 'radio'
  manualRadioInput.value = 'manual'

  manualRadioInputLabel.textContent = 'Manual Form'
  manualRadioInputLabel.htmlFor = 'manual-creation-form'

  fieldset.append(legend, jsonRadioInput, jsonRadioInputLabel, manualRadioInput, manualRadioInputLabel)

  return fieldset
}

function setupRankerOptionsFieldset() {
  const fieldset = document.createElement('fieldset')
  const legend = document.createElement('legend')
  const initialELOInput = document.createElement('input')
  const initialELOInputLabel = document.createElement('label')
  const kValueInput = document.createElement('input')
  const kValueInputLabel = document.createElement('label')

  legend.textContent = 'Optional options for the ranker'

  initialELOInput.id = 'initial-elo'
  initialELOInput.name = 'initial_elo'
  initialELOInput.type = 'number'
  initialELOInput.min = '100'
  initialELOInput.max = '10000'
  initialELOInput.step = '1'
  initialELOInput.placeholder = '1000'

  initialELOInputLabel.textContent = 'Initial Elo'
  initialELOInputLabel.htmlFor = 'initial-elo'

  kValueInput.id = 'k-value'
  kValueInput.name = 'k_value'
  kValueInput.type = 'number'
  kValueInput.min = '1'
  kValueInput.max = '100'
  kValueInput.step = '1'
  kValueInput.placeholder = '24'

  kValueInputLabel.textContent = 'K Value'
  kValueInputLabel.htmlFor = 'k-value'

  fieldset.append(legend, initialELOInputLabel, initialELOInput, kValueInputLabel, kValueInput)

  return fieldset
}

const mainForm = document.createElement('form')
const formTypeFieldset = setupFormTypeFieldset()
const rankerOptionsFieldset = setupRankerOptionsFieldset()
const rankerDataFieldset = document.createElement('fieldset')
const submitButton = document.createElement('button')

submitButton.type = 'submit'
submitButton.textContent = 'Submit'

rankerOptionsFieldset.className = 'form-flex-column'
rankerDataFieldset.className = 'form-flex-column'

mainForm.append(formTypeFieldset, rankerOptionsFieldset, rankerDataFieldset, submitButton)

APP.replaceChildren(mainForm)

setupForm(mainForm, rankerDataFieldset)
