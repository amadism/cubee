const flags = {
  de: '🇩🇪',
  en: '🇬🇧',
  es: '🇪🇸',
  fr: '🇫🇷',
  it: '🇮🇹',
  tr: '🇹🇷',
  ru: '🇷🇺',
} as const

type Flag = (typeof flags)[keyof typeof flags]

export function getCountryFlag(country: string) {
  return (flags as any)[country] as Flag | undefined
}

export function useCountryFlag(country: MaybeRefOrGetter<string>) {
  const _country = toRef(country)
  return computed(() => getCountryFlag(_country.value))
}
