<script
  setup
  lang="ts"
  generic="
    TLocation extends { id: unknown; location: { lat: number; lng: number } }
  "
>
import {
  MapboxGeolocateControl,
  MapboxMap,
  MapboxMarker,
  // @ts-ignore missing types
} from '@studiometa/vue-mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const config = useRuntimeConfig()

const { locations, mode } = defineProps<{
  locations?: TLocation[]
  mode: 'station' | 'driver'
}>()

const { activeStations: allStations } = useStations()

const mapCenter = computed(() => {
  if ((locations?.length ?? 0) > 0) {
    return [locations![0].location.lng, locations![0].location.lat]
  }

  const center = allStations.value[0]?.location
  if (center) {
    return [center.lng, center.lat]
  }

  return [10.4515, 51.1657] // Germany
})

const markerLocations = computed(() => {
  if (mode === 'driver') {
    return locations
  }
  return locations?.length
    ? locations
    : (allStations.value as unknown as TLocation[])
})
</script>

<template>
  <div class="h-[65vh] overflow-hidden rounded-lg">
    <MapboxMap
      class="h-full"
      :access-token="config.public.mapbox.accessToken"
      map-style="mapbox://styles/modernice/clx1x53gt01qf01qr83qgauzj"
      :center="mapCenter"
      :zoom="10"
    >
      <MapboxGeolocateControl />
      <MapboxMarker
        v-for="location in markerLocations"
        :key="location.id"
        :lng-lat="[location.location.lng, location.location.lat]"
        color="#FEC700"
      >
        <img
          v-if="mode === 'station'"
          src="/station.png"
          style="height: 40px; width: 40px"
        />
        <img
          v-else-if="mode === 'driver'"
          src="/car.png"
          style="height: 40px; width: 40px"
        />
      </MapboxMarker>
    </MapboxMap>
  </div>
</template>
