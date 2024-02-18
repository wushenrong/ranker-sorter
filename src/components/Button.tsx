import type { AriaRole, MouseEventHandler, ReactNode } from 'react'

import classNames from 'classnames'

import styles from '../styles/Button.module.css'

export interface ButtonProperties {
  children: ReactNode
  className?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
  role?: AriaRole
  type: 'button' | 'submit'
}

function Button({
  children,
  className,
  onClick,
  role,
  type,
}: ButtonProperties) {
  return (
    <button
      className={classNames(className, styles.button)}
      onClick={onClick}
      role={role}
      type={type}
    >
      {children}
    </button>
  )
}

export default Button
