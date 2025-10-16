export function useZipLocation() {
  const { public: publicConfig } = useRuntimeConfig()
  const apiKey: string = publicConfig.googleMaps?.apiKey || ''

  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function getLocationByZip(zip: string): Promise<{ lat: number; lon: number; location_name: string } | null> {
    const normalized = (zip || '').trim()
    if (!/^\d{5}$/.test(normalized)) {
      error.value = 'Please provide a valid 5-digit German postal code.'
      return null
    }
    if (!apiKey) {
      error.value = 'Missing Google Maps API key.'
      return null
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?components=country:DE|postal_code:${normalized}&key=${apiKey}`

    isLoading.value = true
    error.value = null

    try {
      const data = await $fetch<{
        status: string
        results: Array<{ formatted_address?: string; geometry?: { location?: { lat?: number; lng?: number } } }>
        error_message?: string
      }>(url)

      if (data.status !== 'OK' || !data.results?.length) {
        console.warn('Geocoding by zip failed:', data.status, data.error_message)
        error.value = data.error_message || 'No results for the provided postal code.'
        return null
      }

      const first = data.results[0]
      const lat = first.geometry?.location?.lat
      const lng = first.geometry?.location?.lng
      const locationNameRaw = first.formatted_address || ''
      const locationName = locationNameRaw.replace(/^\d{5}\s+/, '')

      if (typeof lat !== 'number' || typeof lng !== 'number') {
        error.value = 'Failed to resolve coordinates for the postal code.'
        return null
      }

      return { lat, lon: lng, location_name: locationName }
    } catch (err: any) {
      error.value = err?.message || 'Failed to fetch location by postal code.'
      return null
    } finally {
      isLoading.value = false
    }
  }

  return {
    isLoading,
    error,
    getLocationByZip,
  }
}


