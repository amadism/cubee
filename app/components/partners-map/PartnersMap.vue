<script setup lang="ts">
import {
  MapboxGeolocateControl,
  MapboxMap,
  MapboxMarker,
  // @ts-expect-error missing types
} from '@studiometa/vue-mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { distanceBetween } from '~/composables/useDistance'

interface Partner {
  id: string
  location: {
    lat: number
    lng: number
  }
}

interface UserLocation {
  lat: number
  lng: number
  name: string
}

const props = defineProps<{
  partners: Partner[]
  userLocation?: UserLocation
}>()

const isMapLoaded = ref(false)

onMounted(() => {
  setTimeout(() => {
    if (!isMapLoaded.value) {
      console.log('Timeout reached, hiding loading indicator')
      isMapLoaded.value = true
    }
  }, 2000)
})

const mapCenter = computed(() => {
  if (props.userLocation) {
    return [props.userLocation.lng, props.userLocation.lat]
  }
  if (props.partners?.length > 0) {
    return [props.partners[0].location.lng, props.partners[0].location.lat]
  }
  
  // Default center to Germany if no partners
  return [10.4515, 51.1657]
})

const mapZoom = computed(() => {
  if (props.userLocation) {
    return 10 
  }
  if (props.partners?.length > 1) {
    return 8 
  }
  return 10
})

const nearbyPartnersCount = computed(() => {
  if (!props.userLocation) return 0
  
  const radiusInMeters = 50000
  return props.partners.filter(partner => {
    const distance = distanceBetween(
      { lat: props.userLocation!.lat, lng: props.userLocation!.lng },
      { lat: partner.location.lat, lng: partner.location.lng }
    )
    return distance <= radiusInMeters
  }).length
})

const nearbyPartnersText = computed(() => {
  if (!props.userLocation) return ''
  
  const count = nearbyPartnersCount.value
  if (count === 0) {
    return 'No partners nearby, but we\'ll find the closest one for you!'
  } else if (count === 1) {
    return '1 partner nearby - we\'ve got you covered!'
  } else {
    return `${count} partners nearby - we\'ve got you covered!`
  }
})

const onMapLoad = () => {
  isMapLoaded.value = true
}

const onMapReady = () => {
  isMapLoaded.value = true
}

const onStyleLoad = () => {
  isMapLoaded.value = true
}
</script>

<template>
  <div class="aspect-square overflow-hidden rounded-lg relative">
    <!-- Loading -->
    <div v-if="!isMapLoaded" class="absolute inset-0 bg-gray-100 flex items-center justify-center z-10">
      <div class="flex flex-col items-center space-y-3">
        <div class="animate-spin rounded-full h-8 w-8 border-2 border-l-transparent border-yellow-500"></div>
        <p class="text-sm text-gray-600 font-poppins">Loading map...</p>
      </div>
    </div>

    <MapboxMap
      class="h-full w-full"
      access-token="pk.eyJ1IjoibW9kZXJuaWNlIiwiYSI6ImNseDF3ZmdsdjBkd3cycXM5NXZlYTBxd2IifQ.4TdDROuEq-7vnDBBqjO8cw"
      map-style="mapbox://styles/modernice/clx1x53gt01qf01qr83qgauzj"
      :center="mapCenter"
      :zoom="mapZoom"
      @load="onMapLoad"
      @ready="onMapReady"
      @styleload="onStyleLoad"
    >
      <MapboxGeolocateControl />
      
      <!-- User Location Marker -->
      <MapboxMarker
        v-if="userLocation"
        :lng-lat="[userLocation.lng, userLocation.lat]"
        color="#3B82F6"
      >
        <div class="flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full border-3 border-white shadow-lg">
          <svg 
            class="w-5 h-5 text-white" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      </MapboxMarker>
      
      <!-- Partner Markers -->
      <MapboxMarker
        v-for="partner in partners"
        :key="partner.id"
        :lng-lat="[partner.location.lng, partner.location.lat]"
        color="#FEC700"
      >
        <div class="flex items-center justify-center w-8 h-8 bg-yellow-400 rounded-full border-2 border-white shadow-lg">
          <svg 
            class="w-4 h-4 text-gray-700" 
            fill="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      </MapboxMarker>
    </MapboxMap>
    
    <!-- Nearby Partners Text -->
    <div v-if="userLocation && nearbyPartnersText && isMapLoaded" class="absolute bottom-4 left-4 right-4">
      <div class="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
        <p class="text-sm text-gray-700 font-poppins text-center">
          {{ nearbyPartnersText }}
        </p>
      </div>
    </div>
  </div>
</template>
