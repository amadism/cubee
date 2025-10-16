import { Address } from './schema.js'

/**
 * Formats an {@link Address} object into a multi-line string, with the option
 * to customize the display of the country name using a callback function passed
 * through the `options` parameter.
 */
export function formatAddress<A extends Address<any>>(
  address: A,
  options?: {
    countryName?: (country: A['country']) => string
  },
) {
  const { line1, line2, line3, locality, region, postalCode, country } = address

  let lines = [line1, line2, line3].filter(Boolean)
  lines = [
    ...lines,
    `${postalCode}, ${locality}`,
    region,
    country && options?.countryName
      ? options.countryName(country)
      : country ?? '',
  ].filter(Boolean)

  return lines.join('\n')
}
