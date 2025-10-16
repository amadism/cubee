import type { MaybeRefOrGetter } from 'vue'
import { computed, toRef } from 'vue'
import { $fetch, Headers } from 'ofetch'
import type {
  FetchError,
  FetchRequest,
  FetchOptions as OFetchOptions,
} from 'ofetch'
import type { Pinia } from 'pinia'
import type { OFetchMappedType, OFetchResponseType } from './ofetch.js'
import { useFetchConfig } from './config.js'

/**
 * The `defaultBaseHeaders` variable is an object containing the default base
 * headers to be used in HTTP requests. It includes a `Content-Type` header with
 * a value of `application/json`.
 */
export const defaultBaseHeaders = {
  'Content-Type': 'application/json' as const,
} satisfies HeadersInit

/**
 * FetchOptions is an interface that defines optional configuration options for
 * the fetch function. It includes properties for the base URL, headers,
 * authentication, and a custom error parser.
 */
export interface FetchOptions {
  /**
   * The optional `baseUrl` property of `FetchOptions` specifies a base URL that
   * will be used for all requests made with the configured fetch function. It
   * can be a static string or a reactive reference to a string. If defined, it
   * will override the default base URL provided by the `useFetchConfig`
   * function.
   */
  baseUrl?: MaybeRefOrGetter<string>
  /**
   * Specifies the custom HTTP headers for an HTTP request. This property is
   * optional, and if not set, the default headers are used. Within the context
   * of `FetchOptions`, `headers` is used to define any custom headers that
   * should be included in a fetch request.
   */
  headers?: MaybeRefOrGetter<HeadersInit | undefined | null>
  /**
   * The `auth` property of `FetchOptions` is used to specify authentication
   * headers to be added to the request. It is a MaybeRefOrGetter of type
   * `HeadersInit`. If provided, the headers will be merged with the base
   * headers specified by `headers` property, and added to the request headers.
   */
  auth?: FetchAuth
  /**
   * The `parseError` property of `FetchOptions` is a function that takes a
   * `FetchError` as input and returns either a string or an `Error`. It is used
   * to handle errors that occur during fetch requests. If `parseError` is
   * provided, the returned error will be passed through this function before
   * being thrown. If the function returns a string, it will be thrown as an
   * `Error`. If it returns an `Error`, it will be re-thrown. If `parseError` is
   * not provided, any errors will be thrown directly.
   */
  parseError?: (error: FetchError) => string | Error
}

/**
 * FetchAuth represents a possible authentication header for a fetch request. It
 * can be a {@link MaybeRefOrGetter} of {@link HeadersInit}. When used in
 * conjunction with {@link defineFetch}, the authentication headers will be
 * added to the final headers of the fetch request.
 */
export type FetchAuth = MaybeRefOrGetter<HeadersInit>

/**
 * This function defines a fetch method with the given name and options. It
 * returns an object containing a fetch method and a setBaseUrl method. The
 * fetch method sends an HTTP request to the specified URL with the specified
 * options, and returns a Promise that resolves with the response data. If an
 * error occurs during the request, it will be caught and parsed according to
 * the provided parseError function (if any) before being re-thrown as an Error.
 * The setBaseUrl method updates the base URL for subsequent requests made by
 * the fetch method.
 */
export function defineFetch(name: string, options?: FetchOptions) {
  const _baseUrl = toRef(options?.baseUrl)

  const baseHeaders = toRef(options?.headers ?? { ...defaultBaseHeaders })
  const authHeadersInit = toRef(options?.auth)

  const headers = computed(() => {
    const headers = new Headers({ ...baseHeaders.value })

    /**
     * Add authentication headers.
     */
    if (authHeadersInit.value) {
      new Headers(authHeadersInit.value).forEach((value, key) =>
        headers.set(key, value),
      )
    }

    return headers
  })

  function createFetch(pinia?: Pinia) {
    const { baseUrl } = useFetchConfig(pinia)

    const url = _baseUrl.value ?? baseUrl(name)

    return $fetch.create({
      baseURL: url,
      headers: headers.value,
    })
  }

  return (pinia?: Pinia) => {
    const { setBaseUrl: _setBaseUrl } = useFetchConfig(pinia)

    const fetch: FetchFn = async (request, opts) => {
      try {
        return await createFetch(pinia)(request, opts)
      } catch (e) {
        const err = options?.parseError
          ? options.parseError(e as FetchError)
          : e
        if (typeof err === 'string') {
          throw new TypeError(err)
        }
        throw err
      }
    }

    function setBaseUrl(url: string) {
      _setBaseUrl(name, url)
    }

    return {
      fetch,
      setBaseUrl,
    }
  }
}

/**
 * FetchFn is a type alias for a function that takes a FetchRequest and
 * OFetchOptions as parameters, and returns a Promise of an OFetchMappedType.
 */
export type FetchFn = <T = any, R extends OFetchResponseType = 'json'>(
  request: FetchRequest,
  options?: OFetchOptions<R>,
) => Promise<OFetchMappedType<R, T>>
