export * from './components'
export * from './helper'

export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}