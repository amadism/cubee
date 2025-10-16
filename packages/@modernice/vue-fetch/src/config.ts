import { defineStore } from 'pinia'
import { reactive } from 'vue'

/**
 * A Pinia store for managing fetch configurations. Use the `baseUrl` function
 * to retrieve a configuration's base URL, and the `setBaseUrl` function to set
 * a configuration's base URL.
 */
export const useFetchConfig = defineStore('@modernice/vue-fetch', () => {
  /**
   * A reactive object that stores configurations for different fetch requests.
   * \/ const configs: Record<string, { baseUrl: string }>
   */
  const configs = reactive({} as Record<string, { baseUrl: string }>)

  /**
   * Returns the base URL for a given fetch configuration, or an empty string if
   * no base URL is set.
   */
  function baseUrl(config: string) {
    return configs[config]?.baseUrl ?? ''
  }

  /** Sets the base URL for a given configuration. */
  function setBaseUrl(config: string, url: string) {
    configs[config] = { ...configs[config], baseUrl: url }
  }

  return {
    configs,
    baseUrl,
    setBaseUrl,
  }
})
