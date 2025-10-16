import type { UserLocation } from '~/components/appointment/location-selection'

export type Driver = {
  id: number
  slug: string
  name: string
  address: string
  contact: string
  url: string
  location: {
    lat: number
    lng: number
  }
}

export function useDrivers() {
  const drivers = useState('drivers', (): Driver[] => [
    {
      id: 1,
      slug: 'hildesheim',
      name: 'Hildesheim',
      address: 'Hildesheim, Germany',
      contact: '+4915121167460',
      url: 'https://app.acuityscheduling.com/schedule.php?owner=33374738&appointmentType=68516433',
      location: {
        lat: 52.15489,
        lng: 9.973175,
      },
    },
    {
      id: 2,
      name: 'Bonn',
      slug: 'bonn',
      address: 'Bonn, Germany',
      contact: '+4915121167460',
      url: 'https://app.acuityscheduling.com/schedule.php?owner=33374738&appointmentType=69280715',
      location: {
        lat: 50.746329,
        lng: 7.12391,
      },
    },
  ])

  return { drivers }
}

export function useNearbyDrivers(userLocation: MaybeRefOrGetter<UserLocation>) {
  const { drivers } = useDrivers()
  return useNearby(drivers, userLocation, { maxDistance: 100_000 })
}

export function useDriver(
  _slug: MaybeRefOrGetter<string | null | undefined>,
) {
  const slug = toRef(_slug)
  const { drivers } = useDrivers()
  return computed(
    () =>
      drivers.value.find(
        (driver) => driver.slug === slug.value,
      ) as Driver | undefined,
  )
}