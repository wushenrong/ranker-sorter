/**
 * SPDX-FileCopyrightText: 2023 Samuel Wu
 *
 * SPDX-License-Identifier: CC0-1.0
 */

function factorial(n: number): number {
  let output = 1

  for (let i = 1; i <= n; i++) {
    output *= i
  }

  return output
}

function combinations(n: number, k: number) {
  return factorial(n) / (factorial(k) * factorial(n - k))
}

export { combinations, factorial }
