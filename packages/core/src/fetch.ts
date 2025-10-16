import { defineFetch } from '@modernice/vue-fetch'

/**
 * Provides a {@link defineFetch} instance for fetching data from the 'api'
 * endpoint and parsing errors.
 */
export const useApi = defineFetch('api', {
  parseError: (err) =>
    new Error((err.data?.error as string | undefined) ?? err.message),
})
