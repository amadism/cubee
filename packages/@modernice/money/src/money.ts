/**
 * Money is an interface representing a monetary value consisting of an amount
 * and currency. It is generic over the currency type, which defaults to a
 * string. The amount property represents the numeric value of the money, while
 * the currency property represents the currency code or symbol. The createMoney
 * function returns an object of type Money with the given amount and currency,
 * while createMoneyFactory returns a function that creates Money objects with
 * the same currency. The EUR and USD functions are shorthand for creating Money
 * objects with the respective currencies.
 */
export interface Money<Currency = string> {
  /**
   * The "amount" property of the "Money" interface represents the value of the
   * money in its given currency. It is used to store and retrieve the numerical
   * value of the money within the context of a specific currency.
   */
  amount: number
  /**
   * The `currency` property of the `Money` interface represents the currency of
   * the monetary value. It is used to specify the currency when creating a new
   * `Money` object using the `createMoney()` function or its factory functions
   * such as `EUR()` and `USD()`. The currency can be any string value, but it
   * is recommended to use ISO 4217 currency codes for consistency.
   */
  currency: Currency
}

/**
 * Creates a new Money object with the specified amount and currency. The
 * currency can be any string value. Returns a Money object with the amount and
 * currency properties.
 */
export function createMoney<Currency = string>(
  amount: number,
  currency: Currency
): Money<Currency> {
  return {
    amount,
    currency,
  }
}

/**
 * Creates a factory function that returns a new {@link Money} object with the
 * specified currency code and the amount passed as argument.
 */
export function createMoneyFactory<Currency = string>(currency: Currency) {
  return (amount: number) => createMoney(amount, currency)
}

/**
 * Creates a new instance of {@link Money} with the given amount and 'EUR' as
 * the currency.
 */
export function EUR(amount: number) {
  return createMoney(amount, 'EUR' as const)
}

/** Creates a new Money object with the specified amount and USD currency. */
export function USD(amount: number) {
  return createMoney(amount, 'USD' as const)
}
