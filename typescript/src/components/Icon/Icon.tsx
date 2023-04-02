type IconProp = {
  src: string
  title: string
}

export function Icon ({ src, title }: IconProp): JSX.Element {
  return <img src={src} title={title} width='64' height='64' />
}

export default Icon
