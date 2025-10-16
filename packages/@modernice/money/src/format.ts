import { Money } from './money.js'

/**
 * FormatterOptions defines options for formatting a {@link Money} object into a
 * human-readable string using the {@link
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat}
 * API. It allows you to specify locales, intl options, fallback value, base and
 * exponent for the currency's minor unit.
 */
export interface FormatterOptions<
  FallbackCurrency extends string = string,
  Fallback extends string | Money<FallbackCurrency> = never
> {
  /**
   * The locales to use when formatting the money.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat#using_locales} for more information.
   */
  locales?: string | string[]

  /**
   * Options to pass to the {@link Intl.NumberFormat} constructor.
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat} for more information.
   */
  intl?: Omit<Intl.NumberFormatOptions, 'style'>

  /**
   * Fallback value to use when the {@link Money} is `null` or `undefined`.
   * The fallback can be a string or another {@link Money} object.
   */
  fallback?: Fallback

  /**
   * The number of unique digits used to represent the currency's minor unit.
   * Most currencies in circulation are decimal (base 10), including USD and EUR.
   *
   * @default 10
   */
  base?: number

  /**
   * The number of decimal places to use when formatting the money.
   * Most currencies in circulation have 2 decimal places, including USD and EUR.
   *
   * @default 2
   */
  exponent?: number
}

/**
 * Formats a {@link Money} object into a human-readable string using the
 * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat} API.
 */
export function formatMoney<
  Currency extends string = string,
  FallbackCurrency extends string = string,
  Fallback extends string | Money<FallbackCurrency> = never
>(
  m: MaybeNullable<Fallback, Money<Currency>>,
  options?: FormatterOptions<FallbackCurrency, Fallback>
): string {
  if (options?.fallback !== undefined && !m) {
    if (typeof options.fallback === 'string') {
      return options.fallback
    }
    return formatMoney(options.fallback as Money<FallbackCurrency>, options)
  }

  if (!m) {
    return '<null>'
  }

  return createFormatter(m.currency, options).format(m)
}

function createFormatter<
  Currency extends string,
  FallbackCurrency extends string,
  Fallback extends string | Money<FallbackCurrency> = never
>(currency: Currency, options?: FormatterOptions<FallbackCurrency, Fallback>) {
  const opts: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: currency,
  }

  const formatter = new Intl.NumberFormat(options?.locales, {
    ...opts,
    ...options?.intl,
  })

  /**
   * Formats a {@link Money} object into a human-readable string.
   */
  function format(m: Money<Currency> | number) {
    const base = options?.base ?? 10
    const exponent = options?.exponent ?? 2

    return formatter.format(
      (typeof m === 'number' ? m : m.amount) / base ** exponent
    )
  }

  return {
    formatter,
    format,
  }
}

type MaybeNullable<Fallback, T> = [Fallback] extends [never]
  ? Exclude<T, null | undefined>
  : T | null | undefined
