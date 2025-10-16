import type { MaybeRefOrGetter } from 'vue'
import { computed, toRef } from 'vue'

/**
 * Returns an object with a computed property "Authorization" that contains the
 * token passed as parameter, if any, in a Bearer format. If the token is not
 * available or empty, the "Authorization" property will be an empty string.
 */
export function bearerAuth(token: MaybeRefOrGetter<string>) {
  const _token = toRef(token)

  return computed(() => ({
    Authorization: _token.value ? `Bearer ${_token.value}` : '',
  }))
}
