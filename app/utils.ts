export function shuffleArray<T>(array: T[]) {
  const shuffledArray = [...array]

  const swap = (arr: T[], i: number, j: number) => {
    const temp = arr[i]
    arr[i] = arr[j]
    arr[j] = temp
  }

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    swap(shuffledArray, i, j)
  }

  return shuffledArray
}
