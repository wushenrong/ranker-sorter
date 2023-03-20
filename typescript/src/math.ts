export const factorial = (n: number): number => {
  let factorial = n
  for (let i = n - 1; i > 0; i--) {
    factorial *= i
  }
  return factorial
}

export const permutation = (n: number, k: number): number =>
  factorial(n) / factorial(n - k)

export const combination = (n: number, k: number): number =>
  permutation(n, k) / factorial(k)
