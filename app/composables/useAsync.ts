import type { KeysOf, PickFrom } from '#app/composables/asyncData'
import type { AsyncDataOptions } from '#app'

/**
 * Returns a tuple of computed result and async data object obtained from the
 * provided fetch function.
 */
export function useAsync<Data, Result = Data>(
  fetch: () => MaybePromise<Data>,
  parse?: (data: PickFrom<Data, KeysOf<Data>>) => Result,
  options?: AsyncDataOptions<Data, Data> & { key?: string },
) {
  const asyncData = options?.key
    ? useAsyncData(options.key, async () => await fetch(), options)
    : useAsyncData(async () => await fetch(), options)

  const { data } = asyncData

  const result = computed(
    () =>
      (data.value
        ? parse
          ? parse(data.value)
          : data.value
        : null) as Result | null,
  )

  return [result, asyncData] as const
}

type MaybePromise<T> = T | Promise<T>