import type { RouteLocation, RouteLocationRaw } from '#vue-router'

export function useCustomLocalePath(options?: { baseUrl?: boolean | string }) {
  const config = useRuntimeConfig()
  const baseUrl =
    typeof options?.baseUrl === 'string'
      ? options.baseUrl
      : options?.baseUrl
        ? (config.public.app as { url: string }).url
        : undefined

  const localePath = useLocalePath()

  return (route: RouteLocation | RouteLocationRaw, locale?: string) => {
    const path = localePath(route, locale)
    return baseUrl ? `${baseUrl}${path}` : path
  }
}
