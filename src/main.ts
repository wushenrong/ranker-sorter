import { setupForm } from './form'
import './index.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <form>
    <fieldset id="form-type">
      <legend>Please select how the ranker will be created</legend>
      <input id="file" name="type" type="radio" value="json" required checked>
      <label for="file">JSON File</label>
      <input id="manual" name="type" type="radio" value="manual">
      <label for="manual">Manual Form</label>
    </fieldset>
    <fieldset id="ranker-options">
      <legend>Optional options for the ranker</legend>
      <label for="initial-elo">Initial Elo</label>
      <input id="initial-elo" name="initial_elo" type="number" min="100" max="10000" step="1" placeholder="1000">
      <label for="k-value">K Value</label>
      <input id="k-value" name="k_value" type="number" min="1" max="100" step="1" placeholder="24">
    </fieldset>
    <fieldset id="ranker-data"></fieldset>
    <button type="submit">Submit</button>
  </form>
`

setupForm(document.querySelector<HTMLFormElement>('form')!)
