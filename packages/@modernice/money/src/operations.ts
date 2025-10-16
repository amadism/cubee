import { createMoney, Money } from './money.js'

/**
 * Adds up multiple {@link Money} objects and returns the total amount as a new
 * {@link Money} object with the same currency.
 */
export function addMoney<Currency = string>(
  ...mn: Money<Currency>[]
): Money<Currency> {
  const amount = mn.reduce((total, m) => total + m.amount, 0)
  return createMoney<Currency>(amount, mn?.[0].currency ?? ('' as Currency))
}

/**
 * Subtracts the amounts of the given {@link Money} objects and returns a new
 * {@link Money} object with the resulting amount and currency.
 */
export function subtractMoney<Currency = string>(...mn: Money<Currency>[]) {
  const amount = mn.reduce((total, m) => total - m.amount, 0)
  return createMoney<Currency>(amount, mn?.[0].currency ?? ('' as Currency))
}

/** Multiplies the amount of a {@link Money} instance by a given factor. */
export function multiplyMoney<Currency = string>(
  m: Money<Currency>,
  factor: number
) {
  return createMoney(m.amount * factor, m.currency)
}

/**
 * Divides a {@link Money} object by a divisor and returns the result as a new
 * {@link Money} object.
 */
export function divideMoney<Currency = string>(
  m: Money<Currency>,
  divisor: number
) {
  return createMoney(m.amount / divisor, m.currency)
}
