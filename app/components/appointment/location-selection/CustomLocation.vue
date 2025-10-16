<script setup lang="ts">
import type { UserLocation } from '.'
import { nextTick, watch } from 'vue'

const location = defineModel<UserLocation>()
const emit = defineEmits<{
  'update:modelValue': [value: UserLocation]
}>()

const { t } = useMessages('appointment')

const input = ref('')

const config = useRuntimeConfig()

const mapKey = computed(() => config.public.googleMaps.apiKey)

const gmapsLoaded = useState('gmaps.loaded', () => false)

onMounted(async () => {
  if (!gmapsLoaded.value) {
    gmapsLoaded.value = true
    await loadGoogleMapsScript()
  }

  initializeAutocomplete('autocomplete_address')
})

function loadGoogleMapsScript() {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?libraries=places&key=${mapKey.value}`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = (error) => reject(error)
    document.head.appendChild(script)
  })
}

function initializeAutocomplete(id: string) {
  const element = document.getElementById(id) as HTMLInputElement

  if (element) {
    const autocomplete = new google.maps.places.Autocomplete(element, {
      types: ['geocode'],
      componentRestrictions: { country: 'DE' },
    })

    autocomplete.addListener('place_changed', async () => {
      const place = autocomplete.getPlace()
      const data = {
        name: place.name ?? '<no name>',
        lat: place.geometry?.location?.lat() ?? 0,
        lng: place.geometry?.location?.lng() ?? 0,
      }

      
      await nextTick()
      location.value = data
      emit('update:modelValue', data)
      
      // Clear input after place selection
      input.value = ''
    })
  }
}
</script>

<template>
  <input
    id="autocomplete_address"
    v-model="input"
    type="text"
    class="w-full rounded-lg border px-4 py-3 text-lg placeholder:text-sm focus:outline-none"
    :placeholder="t('$vehicle-location.custom')"
  />
</template>
