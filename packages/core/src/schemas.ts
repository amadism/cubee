import { z } from 'zod'
import { parseISO } from 'date-fns'

/**
 * Represents a Zod schema for dates that can also accept strings, which are
 * parsed into Date objects using {@link parseISO}.
 */
export const DateSchema = z
  .date()
  .or(z.string())
  .transform((d) => (typeof d === 'string' ? parseISO(d) : d))

/**
 * A Zod schema for nullable dates that accepts both date objects and ISO 8601
 * date strings and transforms them into date objects using the {@link parseISO}
 * function from date-fns.
 */
export const NullableDateSchema = z
  .date()
  .or(z.string())
  .nullable()
  .transform((s) => (typeof s === 'string' ? parseISO(s) : s))
