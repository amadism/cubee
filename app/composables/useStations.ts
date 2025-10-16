import type { UserLocation } from '~/components/appointment/location-selection'

export type ActiveStation = {
  id: number
  slug: string
  name: string
  address: string
  openHours: [start: number, end: number]
  url: string
  location: {
    lat: number
    lng: number
  }
}

export type InactiveStation = {
  id: number
  slug: string
  name: string
  inactive: true
}

export type Station = ActiveStation | InactiveStation

export function useStations() {
  const stations = useState('stations', (): Station[] => [
    {
      id: 1,
      slug: 'hildesheim',
      name: 'Hildesheim',
      address: 'Senator-Braun-Allee 9, 31135 Hildesheim',
      openHours: [9, 17],
      url: 'https://app.acuityscheduling.com/schedule.php?owner=33374738&calendarID=10852740',
      location: {
        lat: 52.154778,
        lng: 9.952556,
      },
    },
    {
      id: 2,
      slug: 'bonn',
      name: 'Bonn',
      address: 'St. Augustiner Str 145, 53225 Bonn',
      openHours: [9, 17],
      url: 'https://app.acuityscheduling.com/schedule.php?owner=33374738&appointmentType=69280078',
      location: {
        lat: 50.746329,
        lng: 7.12391,
      },
    },
    {
      id: 3,
      slug: 'bad-harzburg',
      name: 'Bad Harzburg',
      address: 'Brunnenstraße 10, 38667 Bad Harzburg',
      openHours: [9, 17],
      url: 'https://app.acuityscheduling.com/schedule.php?owner=33374738&appointmentType=69847089',
      location: {
        lat: 51.90952433330882,
        lng: 10.517458154900456,
      },
    },
    {
      id: 4,
      slug: 'hamburg',
      name: 'Hamburg',
      inactive: true,
    },
    {
      id: 5,
      slug: 'muenchen',
      name: 'München',
      inactive: true,
    },
    {
      id: 6,
      slug: 'stuttgart',
      name: 'Stuttgart',
      inactive: true,
    },
    {
      id: 7,
      slug: 'berlin',
      name: 'Berlin',
      inactive: true,
    },
    {
      id: 8,
      slug: 'frankfurt-am-main',
      name: 'Frankfurt am Main',
      inactive: true,
    },
  ])

  const activeStations = computed(() =>
    stations.value.filter(
      (station): station is ActiveStation => !('inactive' in station),
    ),
  )

  const inactiveStations = computed(() =>
    stations.value.filter(
      (station): station is InactiveStation => 'inactive' in station,
    ),
  )

  return { stations, activeStations, inactiveStations }
}

export function useActiveStation(
  _slug: MaybeRefOrGetter<string | null | undefined>,
) {
  const slug = toRef(_slug)
  const { stations } = useStations()
  return computed(
    () =>
      stations.value.find(
        (station) => !('inactive' in station) && station.slug === slug.value,
      ) as ActiveStation | undefined,
  )
}

export function useNearbyStations(
  userLocation: MaybeRefOrGetter<UserLocation>,
) {
  const { activeStations } = useStations()
  return useNearby(activeStations, userLocation)
}

export function useFormatOpenHours() {
  const { locale } = useI18n()
  return (openHours: [start: number, end: number]) =>
    formatOpenHours(openHours, { locale: locale.value })
}

export function formatOpenHours(
  openHours: [start: number, end: number],
  options?: {
    locale?: string
  },
) {
  const [start, end] = openHours
  const locale = options?.locale ?? 'de-DE'

  const startDate = new Date()
  startDate.setHours(start)
  startDate.setMinutes(0)

  const endDate = new Date()
  endDate.setHours(end)
  endDate.setMinutes(0)

  return `${startDate.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  })} - ${endDate.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
  })}`
}
