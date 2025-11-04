<script setup lang="ts">
import type { UserLocation } from '.'
import { nextTick, watch } from 'vue'

const location = defineModel<UserLocation>()
const emit = defineEmits<{
  'update:modelValue': [value: UserLocation]
}>()

const { t } = useMessages('appointment')

const input = ref('')
const container = ref<HTMLElement | null>(null)

const config = useRuntimeConfig()

const mapKey = computed(() => config.public.googleMaps.apiKey)

const gmapsLoaded = useState('gmaps.loaded', () => false)

onMounted(async () => {
  if (!gmapsLoaded.value) {
    gmapsLoaded.value = true
    await loadGoogleMapsScript()
  }

  initializeAutocomplete()
})

function loadGoogleMapsScript() {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${mapKey.value}&libraries=places&v=weekly`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = (error) => reject(error)
    document.head.appendChild(script)
  })
}

async function initializeAutocomplete() {
  if (!container.value) return
  if (!(window as any).google || !(google.maps && google.maps.places)) {
    try {
      await new Promise((r) => setTimeout(r, 300))
    } catch {}
  }
  const inputEl = document.createElement('input')
  inputEl.className = 'w-full rounded-lg border text-lg placeholder:text-sm focus:outline-none px-3 py-2'
  inputEl.setAttribute('placeholder', t('$vehicle-location.custom'))
  container.value.innerHTML = ''
  container.value.appendChild(inputEl)

  if (!(window as any).google || !google.maps.places) return
  const ac = new google.maps.places.Autocomplete(inputEl as HTMLInputElement, {
    types: ['geocode'],
    componentRestrictions: { country: ['de'] },
  } as any)
  ac.addListener('place_changed', async () => {
    const place = ac.getPlace()
    if (!place) return
    const data = {
      name: (place as any).name || (place as any).formatted_address || '<current>',
      lat:
        (place.geometry as any)?.location?.lat?.() ??
        ((place as any).location?.lat?.() ?? 0),
      lng:
        (place.geometry as any)?.location?.lng?.() ??
        ((place as any).location?.lng?.() ?? 0),
    }
    await nextTick()
    location.value = data
    emit('update:modelValue', data)
    input.value = ''
  })
}
</script>

<template>
  <div ref="container"></div>
</template>
