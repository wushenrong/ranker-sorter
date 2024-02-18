import type { ReactNode } from 'react'

interface TextInputProperties {
  children: ReactNode
  className?: string
  defaultValue?: string
  id: string
  name: string
  required?: boolean
}

import classNames from 'classnames'

import styles from '../../styles/FormPrimitives.module.css'

function TextInput({
  children,
  className,
  defaultValue,
  id,
  name,
  required,
}: TextInputProperties) {
  return (
    <>
      <label className={styles.label} htmlFor={id}>{children}</label>
      <input
        className={classNames(className, styles.centerInput)}
        defaultValue={defaultValue}
        id={id}
        minLength={1}
        name={name}
        required={required}
        type="text"
      />
    </>
  )
}

export default TextInput
