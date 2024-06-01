export const APP = document.querySelector('#app')!

export function beforeUnloadEventListener(event: BeforeUnloadEvent) {
  event.preventDefault()
}

export function addImageToElement(element: HTMLElement, alt: string, source?: string) {
  let image = element.querySelector<HTMLImageElement>('img')

  if (!image) {
    image = document.createElement('img')
  }

  if (source) {
    if (image.src !== source) {
      image.src = source
    }

    image.width = 64
    image.height = 64
    image.alt = alt
    image.referrerPolicy = 'no-referrer'

    element.replaceChildren(image)
  } else {
    element.replaceChildren(alt)
  }
}

export function createBrBlockedParagraph(...lines: string[]) {
  const paragraph = document.createElement('p')

  for (const [index, line] of lines.entries()) {
    paragraph.append(document.createTextNode(line))

    if (index < lines.length) {
      paragraph.append(document.createElement('br'))
    }
  }

  return paragraph
}
