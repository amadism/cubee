import type { ModuleName } from '@modernice/vue-i18n-modules'
import { get, cloneDeep } from 'lodash-es'

export function useI18nArray<TItem = string>(
  module: ModuleName,
  key: string,
  options?: {
    transform?: (item: TItem) => TItem
  },
) {
  const { messages, locale } = useI18n()

  const { messageNamespace } = useMessages(module)

  return computed(() => {
    const namespace = messageNamespace(key as any)

    const msgs = (messages.value[locale.value] ??
      messages.value.en ??
      {}) as any

    const msg = get(msgs, namespace)

    let out = cloneDeep((msg as TItem[] | undefined) ?? [])

    if (options?.transform) {
      out = out.map(options.transform)
    }

    return out
  })
}
