export function useLocationName() {
 const { public: publicConfig } = useRuntimeConfig()
const apiKey: string = publicConfig.googleMaps?.apiKey || ''

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function getLocationName(lat: number, lon: number): Promise<string | null> {
    if (typeof lat !== 'number' || typeof lon !== 'number') {
      error.value = 'Latitude and longitude must be numbers.'
      return null
    }
    if (!apiKey) {
      error.value = 'Missing Google Maps API key.'
      return null
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`

    isLoading.value = true
    error.value = null

    try {
      const data = await $fetch<{
        status: string
        results: Array<{ formatted_address?: string }>
        error_message?: string
      }>(url)

      if (data.status !== 'OK' || !data.results?.length) {
        console.warn('Geocoding failed:', data.status, data.error_message)
        return null
      }

      const formatted = data.results[0]?.formatted_address || ''
      const cleaned = formatted.replace(/^\d{5}\s+/, '')
      return cleaned || null
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch location name.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    getLocationName,
  }
}


