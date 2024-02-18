import type { ReactNode } from 'react'

import classNames from 'classnames'

import styles from '../../styles/FormPrimitives.module.css'

interface JsonFileInputProperties {
  children: ReactNode
  className?: string
  id: string
  name: string
  required?: boolean
}

function JsonFileInput({
  children,
  className,
  id,
  name,
  required,
}: JsonFileInputProperties) {
  return (
    <>
      <label className={styles.label} htmlFor={id}>{children}</label>
      <input
        accept="application/json"
        className={classNames(className, styles.centerInput)}
        id={id}
        name={name}
        required={required}
        type="file"
      />
    </>
  )
}

export default JsonFileInput
