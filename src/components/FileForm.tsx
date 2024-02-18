import type { ReactNode } from 'react'

import styles from '../styles/RankerForm.module.css'
import Fieldset from './FormPrimitives/Fieldset'
import JsonFileInput from './FormPrimitives/JsonFileInput'

interface FileFormProperties {
  children: ReactNode
}

function FileForm({ children }: FileFormProperties) {
  return (
    <Fieldset className={styles.fields}>
      <legend>{children}</legend>
      <JsonFileInput
        className={styles.fileInput}
        id="file"
        name="file"
        required
      >
        Load Ranker From JSON or YAML File
      </JsonFileInput>
    </Fieldset>
  )
}

export default FileForm
