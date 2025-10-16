import { z } from 'zod'
import { createMoney } from './money.js'

/** Represents the schema for validating and parsing a monetary value. */
export const MoneySchema = z.object({
  amount: z.number(),
  currency: z.string(),
})

/**
 * Parses an input value using the {@link MoneySchema} and returns a new money
 * object created with {@link createMoney}.
 */
export function parseMoney<Currency = string, Amount extends number = number>(
  input: unknown
) {
  const { amount, currency } = MoneySchema.parse(input)
  return createMoney(amount as Amount, currency as Currency)
}
