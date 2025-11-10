<template>
  <div class="space-y-6">    
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-700 font-poppins">
          {{ csT('$vehicle.vehicleMakeModel.label') }}
          <span class="text-red-500">*</span>
        </label>
        <Input 
          v-model="localFormData.vehicleMakeModel" 
          :placeholder="csT('$vehicle.vehicleMakeModel.placeholder')"
          class="w-full"
          :class="{ 'border-red-500': errors.vehicleMakeModel }"
          required
        />
        <p v-if="errors.vehicleMakeModel" class="text-red-500 text-sm mt-1 font-poppins">{{ errors.vehicleMakeModel }}</p>
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-700 font-poppins">
          {{ csT('$vehicle.mileage.label') }}
          <span class="text-red-500">*</span>
        </label>
        <Input 
          v-model="localFormData.mileage" 
          :placeholder="csT('$vehicle.mileage.placeholder')"
          class="w-full"
          :class="{ 'border-red-500': errors.mileage }"
          required
        />
        <p v-if="errors.mileage" class="text-red-500 text-sm mt-1 font-poppins">{{ errors.mileage }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-700 font-poppins">
          {{ csT('$vehicle.manufYear.label') }}
          <span class="text-gray-500 text-xs font-normal">({{ csT('$vehicle.manufYear.optional') }})</span>
        </label>
        <Input
          v-model="localFormData.manufYear"
          type="number"
          :placeholder="csT('$vehicle.manufYear.placeholder')"
          class="w-full"
          :class="{ 'border-red-500': errors.manufYear }"
          min="1900"
          max="2100"
        />
        <p v-if="errors.manufYear" class="text-red-500 text-sm mt-1 font-poppins">{{ errors.manufYear }}</p>
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-700 font-poppins">
          {{ csT('$vehicle.previousDamage.label') }}
          <span class="text-red-500">*</span>
        </label>
        <Select v-model="localFormData.previousDamage" required>
          <SelectTrigger :class="{ 'border-red-500': errors.previousDamage }">
            <SelectValue :placeholder="csT('$vehicle.previousDamage.label')" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">{{ csT('$vehicle.previousDamage.yes') }}</SelectItem>
            <SelectItem value="no">{{ csT('$vehicle.previousDamage.no') }}</SelectItem>
          </SelectContent>
        </Select>
        <p v-if="errors.previousDamage" class="text-red-500 text-sm mt-1 font-poppins">{{ errors.previousDamage }}</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const { t: csT } = useMessages('case-submit')

interface FormData {
  vehicleMakeModel: string
  mileage: string
  previousDamage: string
  manufYear?: string
}

interface Errors {
  vehicleMakeModel?: string
  mileage?: string
  previousDamage?: string
  manufYear?: string
}

const props = defineProps<{
  formData: FormData
  errors: Errors
}>()

const emit = defineEmits<{
  'update:formData': [data: FormData]
}>()

const localFormData = ref<FormData>({ ...props.formData })
const errors = ref<Errors>({ ...(props.errors || {}) })

// Watch for changes and emit updates
watch(localFormData, (newData) => {
  emit('update:formData', newData)
}, { deep: true })

// Live-validate on changes so messages appear immediately
watch(localFormData, () => {
  validate()
}, { deep: true })

// Validation function
const validate = (): boolean => {
  const newErrors: Errors = {}
  
  if (!localFormData.value.vehicleMakeModel?.trim()) {
    newErrors.vehicleMakeModel = csT('$vehicle.vehicleMakeModel.required')
  } else if (localFormData.value.vehicleMakeModel.trim().length < 1) {
    newErrors.vehicleMakeModel = csT('$vehicle.vehicleMakeModel.minLength')
  }
  
  if (!localFormData.value.mileage?.trim()) {
    newErrors.mileage = csT('$vehicle.mileage.required')
  } else if (!isValidMileage(localFormData.value.mileage)) {
    newErrors.mileage = csT('$vehicle.mileage.invalid')
  }
  
  if (!localFormData.value.previousDamage) {
    newErrors.previousDamage = csT('$vehicle.previousDamage.required')
  }

  if (localFormData.value.manufYear?.toString().trim()) {
    if (!isValidYear(localFormData.value.manufYear)) {
      newErrors.manufYear = csT('$vehicle.manufYear.invalid')
    }
  }
  
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

defineExpose({ validate })

const isValidMileage = (mileage: string): boolean => {
  const mileageRegex = /^\d+\s*(km|miles?)?$/i
  return mileageRegex.test(mileage.trim())
}

const isValidYear = (year: string): boolean => {
  const yearNumber = Number(year)
  return Number.isInteger(yearNumber) && yearNumber >= 1900 && yearNumber <= new Date().getFullYear()
}
</script>

