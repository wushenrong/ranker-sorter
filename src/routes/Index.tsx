import { type ChangeEvent, useState } from 'react'
import { Form, useActionData } from 'react-router-dom'
import { isValidationErrorLike } from 'zod-validation-error'

import Button from '../components/Button'
import FileForm from '../components/FileForm'
import Fieldset from '../components/FormPrimitives/Fieldset'
import RadioInput from '../components/FormPrimitives/RadioInput'
import ManualForm from '../components/ManualForm'
import styles from '../styles/RankerForm.module.css'

function Index() {
  const [isFileForm, setIsFileForm] = useState(true)
  const error = useActionData()

  if (error != undefined && !isValidationErrorLike(error)) {
    throw error
  }

  const changeForm = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value === 'json') {
      setIsFileForm(true)
      return
    }

    setIsFileForm(false)
  }

  return (
    <Form
      className={styles.rankerForm}
      encType="multipart/form-data"
      method="post"
    >
      <Fieldset>
        <legend>Please select how the ranker will be created</legend>
        <RadioInput
          defaultChecked
          id="file"
          name="type"
          onChange={changeForm}
          required
          value="json"
        >
          JSON or YAML File
        </RadioInput>
        <RadioInput
          id="manual"
          name="type"
          onChange={changeForm}
          value="manual"
        >
          Manual Form
        </RadioInput>
      </Fieldset>

      {
        isFileForm
          ? <FileForm>Select a file that can be used for the ranker</FileForm>
          : <ManualForm>Custom Ranker Creation</ManualForm>
      }
      {error && <p role="alert">{error.toString()}</p>}

      <Button className={styles.submitButton} type="submit">
        Create Ranker
      </Button>
    </Form>
  )
}

export default Index
