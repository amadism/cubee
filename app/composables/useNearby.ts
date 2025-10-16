import type { UserLocation } from '~/components/appointment/location-selection'

export type LocationWithDistance<
  TLocation extends { location: { lat: number; lng: number } },
> = {
  location: TLocation
  distance: number
}

export function useNearby<
  TCandidate extends { location: { lat: number; lng: number } },
>(
  /**
   * An array of candidate locations to be sorted by distance from the user's location.
   */
  candidates: MaybeRefOrGetter<TCandidate[]>,

  /**
   * The user's current location.
   */
  userLocation: MaybeRefOrGetter<UserLocation>,

  /**
   * Optional configuration for the nearby search.
   */
  options?: {
    maxDistance?: number
  },
) {
  const _candidates = toRef(candidates) as Ref<TCandidate[]>
  const _userLocation = toRef(userLocation) as Ref<UserLocation>
  const maxDistance = options?.maxDistance ?? Infinity

  return computed((): LocationWithDistance<TCandidate>[] => {
    const withDistance = _candidates.value.map((location) => ({
      location,
      distance: distanceBetween(_userLocation.value, location.location),
    }))

    const sorted = withDistance.toSorted((a, b) => a.distance - b.distance)

    if (maxDistance) {
      return sorted.filter((candidate) => candidate.distance <= maxDistance)
    }

    return sorted
  })
}
