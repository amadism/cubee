<script setup lang="ts">
import type { UserLocation } from '../location-selection'
import LocationSelection from '~/components/appointment/location-selection/LocationSelection.vue'
import { useState } from '#app'
import { watch, ref, onMounted } from 'vue'
import CaseSubmit from '~/components/case-submit/case-submit.vue'
import PartnersMap from '~/components/partners-map/PartnersMap.vue'

const userLocation = useState('userLocation', (): UserLocation | undefined => undefined)
const partners = ref<Array<{ id: string; location: { lat: number; lng: number } }>>([])
const selectedLocation = ref<UserLocation | undefined>(undefined)

import { useLocationName } from "~/composables/useLocationName";
const { getLocationName } = useLocationName();

onMounted(async () => {
  try {
    const data = await $fetch('/api/partners/public')
    
    if (data && Array.isArray(data)) {
      const mappedPartners = data.map((partner: any) => ({
        id: partner.id.toString(),
        location: {
          lat: partner.lat,
          lng: partner.lon
        }
      }))
      partners.value = mappedPartners
    }
  } catch (error) {
    console.error('Failed to fetch partners:', error)
    partners.value = []
  }
})

watch(userLocation, async (newLocation) => {
  if (newLocation && newLocation.name === '<current>') {
    const locationName = await getLocationName(newLocation.lat, newLocation.lng)
    if (locationName) {
      userLocation.value = {
        ...newLocation,
        name: locationName
      }
    }
  }
}, { immediate: true })

const handleLocationSelected = (location: UserLocation) => {
  selectedLocation.value = location
}

</script>

<template>
  <div class="flex flex-col lg:flex-row gap-4 p-4 lg:p-0">
    <div class="lg:flex-1 overflow-y-auto">
      <CaseSubmit @location-selected="handleLocationSelected" />
    </div>
    
    <div class="w-full lg:w-[39%] aspect-[4/3] lg:aspect-square bg-gray-50 flex-shrink-0">
      <div class="h-full flex flex-col">
        <div class="flex-1">
          <PartnersMap :partners="partners" :user-location="selectedLocation" />
        </div>
      </div>
    </div>
  </div>
</template>
