import type { ReactNode } from 'react'

import classNames from 'classnames'

import styles from '../../styles/FormPrimitives.module.css'

interface FieldsetProperties {
  children: ReactNode
  className?: string
}

function Fieldset({ children, className }: FieldsetProperties) {
  return (
    <fieldset className={classNames(className, styles.margin)}>
      {children}
    </fieldset>
  )
}

export default Fieldset
