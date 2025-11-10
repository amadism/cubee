<template>
  <div class="space-y-6">    
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-700 font-poppins">
          {{ csT('$report.reportType.label') }}
          <span class="text-red-500">*</span>
        </label>
        <Select v-model="localFormData.reportType" required>
          <SelectTrigger :class="{ 'border-red-500': errors.reportType }">
            <SelectValue :placeholder="csT('$report.reportType.placeholder')" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="haftpflichtgutachten">{{ csT('$report.reportType.options.haftpflichtgutachten') }}</SelectItem>
            <SelectItem value="accident">{{ csT('$report.reportType.options.accident') }}</SelectItem>
            <SelectItem value="repair">{{ csT('$report.reportType.options.repair') }}</SelectItem>
            <SelectItem value="other">{{ csT('$report.reportType.options.other') }}</SelectItem>
          </SelectContent>
        </Select>
        <p v-if="errors.reportType" class="text-red-500 text-sm mt-1 font-poppins">{{ errors.reportType }}</p>
      </div>
      
      <!-- Conditional Zuordnung field -->
      <div v-if="shouldShowZuordnung" class="transition-all duration-300">
        <label class="block text-sm font-medium mb-2 text-gray-700 font-poppins">
          {{ csT('$report.zuordnung.label') }}
          <span class="text-red-500">*</span>
        </label>
        <Select v-model="localFormData.zuordnung" required>
          <SelectTrigger :class="{ 'border-red-500': errors.zuordnung }">
            <SelectValue :placeholder="csT('$report.zuordnung.placeholder')" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="geschädigter">{{ csT('$report.zuordnung.options.geschädigter') }}</SelectItem>
            <SelectItem value="unfallverursacher">{{ csT('$report.zuordnung.options.unfallverursacher') }}</SelectItem>
          </SelectContent>
        </Select>
        <p v-if="errors.zuordnung" class="text-red-500 text-sm mt-1 font-poppins">{{ errors.zuordnung }}</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const { t: csT } = useMessages('case-submit')

interface FormData {
  reportType: string
  zuordnung: string
}

interface Errors {
  reportType?: string
  zuordnung?: string
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

// Computed property to determine if Zuordnung field should be shown
const shouldShowZuordnung = computed(() => {
  return localFormData.value.reportType === 'haftpflichtgutachten' || 
         localFormData.value.reportType === 'accident'
})

// Watch for changes and emit updates
watch(localFormData, (newData) => {
  emit('update:formData', newData)
}, { deep: true })

// Live-validate on changes so messages appear immediately
watch(localFormData, () => {
  validate()
}, { deep: true })

// Watch for reportType changes to clear Zuordnung when not needed
watch(() => localFormData.value.reportType, (newReportType) => {
  if (newReportType !== 'haftpflichtgutachten' && newReportType !== 'accident') {
    localFormData.value.zuordnung = ''
  }
})

// Validation function
const validate = (): boolean => {
  const newErrors: Errors = {}
  
  if (!localFormData.value.reportType) {
    newErrors.reportType = csT('$report.reportType.required')
  }
  
  // Validate Zuordnung field if it should be shown
  if (shouldShowZuordnung.value && !localFormData.value.zuordnung) {
    newErrors.zuordnung = csT('$report.zuordnung.required')
  }
  
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

defineExpose({ validate })
</script>
