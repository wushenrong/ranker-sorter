import type { ReactNode } from 'react'

import styles from '../styles/RankerForm.module.css'
import Fieldset from './FormPrimitives/Fieldset'
import TextAreaInput from './FormPrimitives/TextAreaInput'
import TextInput from './FormPrimitives/TextInput'

interface ManualFormProperties {
  children: ReactNode
  invalid?: boolean
}

function ManualForm({ children, invalid: ariaInvalid }: ManualFormProperties) {
  return (
    <Fieldset className={styles.fields}>
      <legend>{children}</legend>
      <TextInput
        defaultValue="Custom Ranker"
        id="title"
        name="title"
        required
      >
        Title of Ranker
      </TextInput>
      <TextAreaInput
        ariaInvalid={ariaInvalid}
        className={styles.characterInput}
        defaultValue="List of character names separated by newlines"
        id="characters"
        name="characters"
        required
      >
        List of Characters
      </TextAreaInput>
    </Fieldset>
  )
}

export default ManualForm
