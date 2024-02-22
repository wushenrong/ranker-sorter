import type { ReactNode } from 'react'

interface FieldsetProperties {
  children: ReactNode
  className?: string
}

function Fieldset({ children, className }: FieldsetProperties) {
  return (
    <fieldset className={className}>
      {children}
    </fieldset>
  )
}

export default Fieldset
