import { intlFormat } from 'date-fns'

/**
 * Formats a given date object or the current date in a localized string
 * representation of the date, following the format "YYYY-MM-DD". The formatting
 * is done using the {@link intlFormat} function from the 'date-fns' library. If
 * no date object is provided, the current date is used as default.
 */
export function formatDate(date?: Date | null) {
  return intlFormat(date ?? new Date(), {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}
