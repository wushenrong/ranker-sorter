interface IconImageProperties {
  alt: string
  src: string
}

function IconImage({ alt, src }: IconImageProperties) {
  return (
    <img
      alt={alt}
      height={64}
      referrerPolicy="no-referrer"
      src={src}
      width={64}
    />
  )
}

export default IconImage
