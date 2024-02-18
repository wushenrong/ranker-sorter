import type { ReactNode } from 'react'

import classNames from 'classnames'

import styles from '../../styles/FormPrimitives.module.css'

interface TextAreaProperties {
  children: ReactNode
  className?: string
  defaultValue?: string
  id: string
  name: string
  required?: boolean
}

function TextAreaInput({
  children,
  className,
  defaultValue,
  id,
  name,
  required,
}: TextAreaProperties) {
  return (
    <>
      <label className={styles.label} htmlFor={id}>{children}</label>
      <textarea
        className={classNames(className, styles.centerInput)}
        defaultValue={defaultValue}
        id={id}
        minLength={3}
        name={name}
        required={required}
      />
    </>
  )
}

export default TextAreaInput
