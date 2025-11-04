<script setup lang="ts">
import type { UserLocation } from '.'
import { ref } from 'vue'

const emit = defineEmits<{ select: [Pick<UserLocation, 'lat' | 'lng'>] }>()

const { t: appointmentT } = useMessages('appointment')

const isLoading = ref(false)
const error = ref<string | null>(null)

function isRetryableError(err: GeolocationPositionError): boolean {
  const errorMsg = String(err.message || '')
  const errorCode = err.code
  
  const retryableCodes = [2, 3]
  
  const retryablePatterns = [
    /LocationUnknown/i,
    /kCLErrorLocationUnknown/i,
    /position unavailable/i,
    /timeout/i,
  ]
  
  return retryableCodes.includes(errorCode) || 
         retryablePatterns.some(pattern => pattern.test(errorMsg))
}

function selectCurrentLocation() {
  if (!navigator.geolocation) {
    error.value = appointmentT('$vehicle-location.error.not-supported')
    return
  }

  isLoading.value = true
  error.value = null

  const getPositionWithRetry = ({ 
    tries = 8, 
    delay = 2000,
    enableHighAccuracy = true,
    timeout = 20000,
    maximumAge = 0
  } = {}) =>
    new Promise<GeolocationPosition>((resolve, reject) => {
      const attempt = (n: number) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos),
          (err) => {
            if (isRetryableError(err) && n > 0) {
              setTimeout(() => attempt(n - 1), delay)
            } else {
              reject(err)
            }
          },
          { enableHighAccuracy, timeout, maximumAge },
        )
      }
      attempt(tries)
    })

  getPositionWithRetry({ enableHighAccuracy: true, timeout: 20000 })
    .then((position) => {
      isLoading.value = false
      error.value = null
      const data = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      emit('select', data)
    })
    .catch((firstErr) => {
      getPositionWithRetry({ 
        tries: 5, 
        enableHighAccuracy: false, 
        timeout: 30000,
        maximumAge: 60000 
      })
        .then((position) => {
          isLoading.value = false
          error.value = null
          const data = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          emit('select', data)
        })
        .catch(() => {
          let watchTimeout: ReturnType<typeof setTimeout> | null = null
          let watchId: number | null = null
          
          const cleanup = () => {
            if (watchTimeout) clearTimeout(watchTimeout)
            if (watchId !== null) navigator.geolocation.clearWatch(watchId)
          }
          
          try {
                         watchTimeout = setTimeout(() => {
               cleanup()
               isLoading.value = false
               error.value = appointmentT('$vehicle-location.error.timeout')
             }, 45000)
            
            watchId = navigator.geolocation.watchPosition(
              (pos) => {
                cleanup()
                isLoading.value = false
                error.value = null
                const data = { lat: pos.coords.latitude, lng: pos.coords.longitude }
                emit('select', data)
              },
                             (err) => {
                 cleanup()
                 isLoading.value = false
                 const errorMsg = String(err.message || '')
                 if (err.code === 1) {
                   error.value = appointmentT('$vehicle-location.error.permission-denied')
                 } else if (/timeout/i.test(errorMsg)) {
                   error.value = appointmentT('$vehicle-location.error.timeout')
                 } else {
                   error.value = appointmentT('$vehicle-location.error.unavailable')
                 }
               },
              { enableHighAccuracy: false, timeout: 25000, maximumAge: 60000 },
            )
                     } catch (e) {
             cleanup()
             isLoading.value = false
             error.value = appointmentT('$vehicle-location.error.unavailable')
           }
        })
    })
}
</script>

<template>
  <div class="space-y-2">
    <Button 
      variant="primary" 
      size="lg" 
      @click="selectCurrentLocation"
      :disabled="isLoading"
      class="w-full"
    >
      <svg
        v-if="!isLoading"
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
      <svg
        v-else
        class="px-1 animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"
        />
      </svg>
             {{ isLoading ? appointmentT('$vehicle-location.locating') : appointmentT('$vehicle-location.use-current') }}
    </Button>
    <p v-if="error" class="text-sm text-red-600 px-1">
      {{ error }}
    </p>
  </div>
</template>
