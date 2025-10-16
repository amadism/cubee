<script lang="js" setup>
import {
  MapboxGeolocateControl,
  MapboxMap,
  MapboxMarker,
} from '@studiometa/vue-mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import '@mapbox/mapbox-gl-geocoder/lib/mapbox-gl-geocoder.css'

definePageMeta({
  middleware: ['i18n:messages'],
  messages: ['finder'],
})

const { t: finderT } = useMessages('finder')

useSeoMeta({
  title: finderT('$seo.title'),
  ogTitle: finderT('$seo.title'),
  description: finderT('$seo.desc'),
  ogDescription: finderT('$seo.desc'),
})

const { stations } = useStations()

const mapCenter = ref([10.4515, 51.1657])
const searchInput = ref('')

const filteredStations = computed(() => {
  if (!searchInput.value) {
    return stations.value
  }

  const words = searchInput.value.trim().toLowerCase().split(/\s+/)

  return stations.value.filter((station) => {
    return words.some((word) => {
      return (
        station.name.toLowerCase().includes(word) ||
        ('address' in station && station.address.toLowerCase().includes(word))
      )
    })
  })
})
</script>

<template>
  <div class="p-5">
    <div class="mx-auto max-w-6xl space-y-4">
      <section>
        <h1
          class="text-xl font-semibold md:text-2xl"
          v-text="finderT('$hero.title')"
        />
      </section>

      <section>
        <div class="grid gap-y-4 md:grid-cols-5 md:gap-4">
          <div
            class="locations-holder relative space-y-4 overflow-hidden rounded-lg md:order-last md:col-span-2 md:max-h-[40rem] md:overflow-y-auto md:overscroll-contain"
          >
            <Input
              id="address"
              v-model="searchInput"
              type="text"
              :placeholder="finderT('$search.input:placeholder')"
            />

            <div class="relative space-y-2">
              <template v-for="station in filteredStations" :key="station.id">
                <FinderComingSoon
                  v-if="'inactive' in station"
                  :station="station"
                />
                <AppointmentContainer v-else :station="station" />
              </template>

              <p
                v-if="!filteredStations.length"
                class="text-center text-gray-400"
              >
                {{ finderT('notFound') }}
              </p>
            </div>
          </div>

          <div class="md:col-span-3">
            <MapboxMap
              class="h-96 overflow-hidden rounded-lg md:h-[40rem]"
              access-token="pk.eyJ1IjoibW9kZXJuaWNlIiwiYSI6ImNseDF3ZmdsdjBkd3cycXM5NXZlYTBxd2IifQ.4TdDROuEq-7vnDBBqjO8cw"
              map-style="mapbox://styles/modernice/clx1x53gt01qf01qr83qgauzj"
              :center="mapCenter"
              :zoom="5"
            >
              <MapboxGeolocateControl />
              <template v-for="station in filteredStations" :key="station.id">
                <MapboxMarker
                  v-if="!('inactive' in station)"
                  :lng-lat="[station.location.lng, station.location.lat]"
                  color="#FEC700"
                />
              </template>
            </MapboxMap>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.location-box {
  @apply relative inline-flex w-full rounded-lg bg-gray-200 p-4;
}

/* .locations-holder::after {
  position: absolute;
  content: '';
  height: 100%;
  width: 100%;
  bottom: 0;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    rgba(7, 13, 21, 0) 0%,
    rgba(7, 13, 21, 0) 95%,
    rgba(7, 13, 21, 0.2) 100%
  );
  mix-blend-mode: darken;
} */
</style>
