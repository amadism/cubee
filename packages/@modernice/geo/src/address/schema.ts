import { z } from 'zod'

/**
 * Address represents a validated postal address with fields for line1, line2,
 * line3, sublocality, locality, region, postal code, and country. It can be
 * customized with a specific list of countries using the {@link
 * AddressSchemaCountries} type or used with any country using the {@link
 * AddressSchemaAnyCountry} type.
 */
export type Address<Countries extends readonly [string, ...string[]]> = z.infer<
  AddressSchema<Countries>
>

/**
 * Creates a {@link AddressSchema} for a given array of countries, or a schema
 * for any country if no countries are specified. The schema includes properties
 * for address lines, sublocality, locality, region, postal code, and country.
 */
export function createAddressSchema<
  Countries extends readonly [string, ...string[]],
>(options?: { countries?: Countries }): AddressSchema<Countries> {
  if (options?.countries) {
    return createCountriesSchema(options.countries) as AddressSchema<Countries>
  }
  return createAnyCountrySchema() as AddressSchema<Countries>
}

/**
 * AddressSchema represents a schema for validating and inferring address
 * objects. It can be created using the createAddressSchema function and
 * supports validation for various properties including line1, line2, line3,
 * sublocality, locality, region, postalCode, and country. The country property
 * can be restricted to a specific set of countries by passing in an array of
 * country codes to the createAddressSchema function.
 */
export type AddressSchema<
  Countries extends readonly [string, ...string[]] = never,
> = [Countries] extends [never]
  ? AddressSchemaAnyCountry
  : AddressSchemaCountries<Countries>

/**
 * AddressSchemaAnyCountry represents the schema for an address with any
 * country. It extends a base schema object with a "country" field of type
 * string.
 */
export type AddressSchemaAnyCountry = ReturnType<typeof createAnyCountrySchema>

function createAnyCountrySchema() {
  return createBaseSchema().extend({
    country: z.string(),
  })
}

/**
 * AddressSchemaCountries represents the schema for an address with a specific
 * list of countries. It extends AddressSchemaAnyCountry and adds a required
 * "country" field that can only have values from the provided list of
 * countries.
 */
export type AddressSchemaCountries<
  Countries extends readonly [string, ...string[]],
> = ReturnType<typeof createCountriesSchema<Countries>>

function createCountriesSchema<
  Countries extends readonly [string, ...string[]],
>(countries: Countries) {
  return createBaseSchema().extend({
    country: z.enum(countries),
  })
}

function createBaseSchema() {
  return z.object({
    line1: z.string(),
    line2: z.string(),
    line3: z.string(),
    sublocality: z.string(),
    locality: z.string(),
    region: z.string(),
    postalCode: z.string(),
  })
}
