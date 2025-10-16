import { cloneDeep } from 'lodash-es'

/**
 * Returns a tuple containing a reactive copy of the provided value and a commit
 * function that updates the original value with any changes made to the copy.
 */
export function useCommitter<T>(value: Ref<T>) {
  const aux = ref(cloneDeep(value.value)) as Ref<T>

  function commit() {
    value.value = cloneDeep(aux.value)
  }

  return [aux, commit] as const
}
