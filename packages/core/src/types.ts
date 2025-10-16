import type { z, ZodTypeAny } from 'zod'

/**
 * MaybeParse is a type that conditionally parses a given Zod schema based on a
 * boolean value. If Parse is false, it returns the Raw schema as is. Otherwise,
 * it infers and returns the parsed schema.
 */
export type MaybeParse<Raw extends ZodTypeAny, Parse extends boolean> = [
  Parse
] extends [false]
  ? Raw
  : z.infer<Raw>
