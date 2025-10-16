<template>
  <div class="space-y-6">
    
    <div class="space-y-4">
      <div>
        <CurrentLocation @select="handleCurrentLocationSelect" class="w-full" />
      </div>
      
      <!-- Divider -->
      <div class="flex items-center">
        <div class="flex-1 h-px bg-gray-300"></div>
        <span class="px-4 text-gray-500 font-poppins text-sm">
          {{ csT('$location.or') }}
        </span>
        <div class="flex-1 h-px bg-gray-300"></div>
      </div>
      
      <!-- Custom Location Input -->
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-700 font-poppins">
          {{ csT('$location.custom.label') }}
        </label>
        <CustomLocation v-model="localFormData.location" />
      </div>
      
      <!-- Selected Location Display -->
      <div v-if="localFormData.location" class="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div class="flex items-center">
          <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
          <div>
            <p class="text-green-800 font-medium font-poppins">
              {{ csT('$location.selected') }}
            </p>
            <p class="text-green-700 text-sm font-poppins">
              {{ localFormData.location.name }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import CurrentLocation from '~/components/appointment/location-selection/CurrentLocation.vue'
import CustomLocation from '~/components/appointment/location-selection/CustomLocation.vue'
import type { UserLocation } from '~/components/appointment/location-selection'
import { useLocationName } from "~/composables/useLocationName"

const { t: csT } = useMessages('case-submit')
const { getLocationName } = useLocationName()

interface FormData {
  location?: UserLocation
}

interface Errors {
  location?: string
}

const props = defineProps<{
  formData: FormData
  errors: Errors
}>()

const emit = defineEmits<{
  'update:formData': [data: FormData]
  'location-selected': [location: UserLocation]
}>()

const localFormData = ref<FormData>({ ...props.formData })

watch(localFormData, (newData) => {
  emit('update:formData', newData)
  if (newData.location) {
    emit('location-selected', newData.location)
  }
}, { deep: true })

// Handle current location selection
const handleCurrentLocationSelect = async (coordinates: { lat: number; lng: number }) => {
  const locationName = await getLocationName(coordinates.lat, coordinates.lng)
  const location: UserLocation = {
    name: locationName || '<current>',
    lat: coordinates.lat,
    lng: coordinates.lng
  }
  localFormData.value.location = location
}

// Validation function
const validate = (): boolean => {
  return !!localFormData.value.location
}

// Expose validate function to parent
defineExpose({ validate })
</script>
