export type GPSLocation = {
  lat: number
  lng: number
}

export function useDistance(
  a: MaybeRefOrGetter<GPSLocation | null | undefined>,
  b: MaybeRefOrGetter<GPSLocation | null | undefined>,
) {
  const _a = toRef(a)
  const _b = toRef(b)

  return computed(() => {
    if (!_a.value || !_b.value) {
      return '0 m'
    }

    const meters = distanceBetween(_a.value, _b.value)
    const unit = meters >= 1000 ? 'km' : 'm'

    if (unit === 'km') {
      let km = meters / 1000
      const shouldRound = km >= 10
      if (shouldRound) {
        km = Math.round(km)
      }
      return `${shouldRound ? km : km.toFixed(2)} ${unit}`
    }

    return `${Math.round(meters).toString()} ${unit}`
  })
}

/**
 * Calculates the distance (in meters) between two GPS locations using the Haversine formula.
 */
export function distanceBetween(a: GPSLocation, b: GPSLocation): number {
  const earthRadiusKm = 6371 // Radius of the Earth in kilometers

  // Convert latitude and longitude differences to radians
  const dLat = toRadians(b.lat - a.lat)
  const dLon = toRadians(b.lng - a.lng)

  // Haversine formula
  const _a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(a.lat)) *
      Math.cos(toRadians(b.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(_a), Math.sqrt(1 - _a))

  // Calculate the distance in kilometers
  const distanceKm = earthRadiusKm * c

  // Convert kilometers to meters and return
  return distanceKm * 1000
}

function toRadians(degree: number): number {
  return degree * (Math.PI / 180)
}
