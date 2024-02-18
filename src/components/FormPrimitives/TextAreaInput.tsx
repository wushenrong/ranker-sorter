import type { ReactNode } from 'react'

import classNames from 'classnames'

import styles from '../../styles/FormPrimitives.module.css'

interface TextAreaProperties {
  ariaInvalid?: boolean
  children: ReactNode
  className?: string
  defaultValue?: string
  id: string
  name: string
  required?: boolean
}

function TextAreaInput({
  ariaInvalid,
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
        aria-invalid={ariaInvalid}
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
