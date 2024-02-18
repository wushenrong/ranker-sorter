import type { ChangeEventHandler, ReactNode } from 'react'

import styles from '../../styles/FormPrimitives.module.css'

interface RadioInputProperties {
  children: ReactNode
  defaultChecked?: boolean
  id: string
  name: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  required?: boolean
  value: string
}

const RadioInput = ({
  children,
  defaultChecked,
  id,
  name,
  onChange,
  required,
  value,
}: RadioInputProperties) => {
  return (
    <>
      <input
        defaultChecked={defaultChecked}
        id={id}
        name={name}
        onChange={onChange}
        required={required}
        type="radio"
        value={value}
      />
      <label className={styles.label} htmlFor={id}>{children}</label>
    </>
  )
}
export default RadioInput
