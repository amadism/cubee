<script setup lang="ts">
import type { UserLocation } from '.'

const emit = defineEmits<{ select: [Pick<UserLocation, 'lat' | 'lng'>] }>()

const { t: appointmentT } = useMessages('appointment')

function selectCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const data = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }

        emit('select', data)
      },
      (error) => {
        console.error('Error getting location:', error)
      },
      { enableHighAccuracy: true, timeout: 5000 },
    )
  } else {
    console.error('Geolocation is not supported by this browser.')
  }
}
</script>

<template>
  <Button variant="primary" size="lg" @click="selectCurrentLocation">
    <svg
      class="px-1"
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 24 24"
    >
      <path
        fill="currentColor"
        d="M11 21.95v-1q-3.125-.35-5.363-2.587T3.05 13h-1q-.425 0-.712-.288T1.05 12t.288-.712T2.05 11h1q.35-3.125 2.588-5.363T11 3.05v-1q0-.425.288-.712T12 1.05t.713.288t.287.712v1q3.125.35 5.363 2.588T20.95 11h1q.425 0 .713.288t.287.712t-.287.713t-.713.287h-1q-.35 3.125-2.587 5.363T13 20.95v1q0 .425-.288.713T12 22.95t-.712-.287T11 21.95M12 19q2.9 0 4.95-2.05T19 12t-2.05-4.95T12 5T7.05 7.05T5 12t2.05 4.95T12 19m0-3q-1.65 0-2.825-1.175T8 12t1.175-2.825T12 8t2.825 1.175T16 12t-1.175 2.825T12 16"
      />
    </svg>
    {{ appointmentT('$vehicle-location.use-current') }}
  </Button>
</template>
