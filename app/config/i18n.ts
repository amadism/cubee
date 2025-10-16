export const locales = [
  {
    code: 'de',
    iso: 'de-DE',
    isCatchallLocale: true,
  },
  {
    code: 'en',
    iso: 'en-US',
  },
  {
    code: 'fr',
    iso: 'fr-FR',
  },
  {
    code: 'it',
    iso: 'it-IT',
  },
  {
    code: 'tr',
    iso: 'tr-TR',
  },
  {
    code: 'ru',
    iso: 'ru-RU',
  },
] as const

export const localeCodes = locales.map((locale) => locale.code)

export function localeToISO(code: string) {
  const locale = locales.find((locale) => locale.code === code)
  return locale ? locale.iso : undefined
}
