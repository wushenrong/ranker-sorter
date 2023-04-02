import './Button.module.css'

type ButtonProps = {
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

function Button ({ children, type, onClick }: ButtonProps): JSX.Element {
  return <button type={type} onClick={onClick}>{children}</button>
}

export default Button
