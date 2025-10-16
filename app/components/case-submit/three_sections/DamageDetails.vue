<template>
  <div class="space-y-6">    
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-700 font-poppins">
          {{ csT('$details.detailedInformation.label') }}
          <span class="text-red-500">*</span>
        </label>
        <Textarea 
          v-model="localFormData.detailedInformation" 
          :placeholder="csT('$details.detailedInformation.placeholder')"
          class="w-full min-h-24"
          :class="{ 'border-red-500': errors.detailedInformation }"
          required
        />
        <p v-if="errors.detailedInformation" class="text-red-500 text-sm mt-1 font-poppins">{{ errors.detailedInformation }}</p>
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-700 font-poppins">{{ csT('$details.uploads.label') }}</label>
        <div class="border-2 border-dashed border-yellow-300 bg-yellow-50/50 rounded-lg p-6 text-center hover:border-yellow-400 hover:bg-yellow-50 transition-colors duration-200">
          <input 
            type="file" 
            multiple 
            accept="image/*,application/pdf"
            @change="handleFileUpload"
            class="hidden"
            ref="fileInput"
          />
          <button 
            type="button"
            @click="fileInput?.click()"
            class="text-yellow-700 hover:text-yellow-800 font-medium font-poppins"
          >
            {{ csT('$details.uploads.cta') }}
          </button>
          <p class="text-sm text-gray-600 mt-2 font-poppins">{{ csT('$details.uploads.hint') }}</p>
        </div>
        
        <!-- Display uploaded files -->
        <div v-if="uploadedFiles.length > 0" class="mt-4">
          <h4 class="text-sm font-medium mb-2 text-gray-700 font-poppins">{{ csT('$details.uploads.listTitle') }}</h4>
          <div class="space-y-2">
            <div 
              v-for="(file, index) in uploadedFiles" 
              :key="index"
              class="flex items-center justify-between bg-yellow-50 border border-yellow-200 p-2 rounded"
            >
              <span class="text-sm text-gray-700 font-poppins">{{ file.name }}</span>
              <button 
                type="button"
                @click="removeFile(index)"
                class="text-red-600 hover:text-red-700 text-sm font-poppins"
              >
                {{ csT('$details.uploads.remove') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Textarea } from '@/components/ui/textarea'
const { t: csT } = useMessages('case-submit')

interface FormData {
  detailedInformation: string
  uploadedFiles: File[]
}

interface Errors {
  detailedInformation?: string
}

const props = defineProps<{
  formData: FormData
  errors: Errors
}>()

const emit = defineEmits<{
  'update:formData': [data: FormData]
}>()

const localFormData = ref<FormData>({ ...props.formData })
const uploadedFiles = ref<File[]>(props.formData.uploadedFiles || [])
const fileInput = ref<HTMLInputElement>()
const errors = ref<Errors>({ ...(props.errors || {}) })

// Watch for changes and emit updates
watch(localFormData, (newData) => {
  emit('update:formData', { ...newData, uploadedFiles: uploadedFiles.value })
}, { deep: true })

// Live-validate on changes so messages appear immediately
watch(localFormData, () => {
  validate()
}, { deep: true })

// File upload handling
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    const newFiles = Array.from(target.files)
    uploadedFiles.value.push(...newFiles)
    emit('update:formData', { ...localFormData.value, uploadedFiles: uploadedFiles.value })
  }
}

const removeFile = (index: number) => {
  uploadedFiles.value.splice(index, 1)
  emit('update:formData', { ...localFormData.value, uploadedFiles: uploadedFiles.value })
}

const validate = (): boolean => {
  const newErrors: Errors = {}
  
  const trimmed = localFormData.value.detailedInformation?.trim() || ''
  if (!trimmed) {
    newErrors.detailedInformation = csT('$details.detailedInformation.required')
  } else if (trimmed.length < 10) {
    newErrors.detailedInformation = csT('$details.detailedInformation.minLength')
  }
  
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

// Expose validate function to parent
defineExpose({ validate })
</script>
