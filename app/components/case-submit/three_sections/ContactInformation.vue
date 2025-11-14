<template>
  <div class="space-y-6">    
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-700 font-poppins">
          {{ csT('$contact.fullName.label') }}
          <span class="text-red-500">*</span>
        </label>
        <Input 
          v-model="localFormData.fullName" 
          :placeholder="csT('$contact.fullName.placeholder')"
          class="w-full"
          :class="{ 'border-red-500': errors.fullName }"
          required
        />
        <p v-if="errors.fullName" class="text-red-500 text-sm mt-1 font-poppins">{{ errors.fullName }}</p>
      </div>
      
      <div>
        <label class="block text-sm font-medium mb-2 text-gray-700 font-poppins">
          {{ csT('$contact.email.label') }}
          <span v-if="localFormData.onWhatsapp === false" class="text-red-500">*</span>
          <span v-else-if="localFormData.onWhatsapp === true" class="text-gray-500 text-xs">({{ csT('$contact.email.optional') }})</span>
          <span v-else class="text-gray-500 text-xs">({{ csT('$contact.email.optional') }})</span>
        </label>
        <Input 
          v-model="localFormData.email" 
          type="email"
          :placeholder="csT('$contact.email.placeholder')"
          class="w-full"
          :class="{ 'border-red-500': errors.email }"
        />
        <p v-if="errors.email" class="text-red-500 text-sm mt-1 font-poppins">{{ errors.email }}</p>
      </div>

      <div>
        <label class="block text-sm font-medium mb-2 text-gray-700 font-poppins">
          {{ csT('$contact.mobile.label') }}
          <span class="text-red-500">*</span>
        </label>
        <Input 
          v-model="localFormData.mobile" 
          type="tel"
          :placeholder="'+49 151 2345678'"
          class="w-full"
          :class="{ 'border-red-500': errors.mobile }"
          inputmode="tel"
          required
        />
        <p class="text-gray-500 text-xs mt-1 font-poppins">
          {{ csT('$contact.mobile.helper') }}
        </p>
        <p v-if="errors.mobile" class="text-red-500 text-sm mt-1 font-poppins">{{ errors.mobile }}</p>
      </div>

      <div class="flex items-center gap-3">
        <label class="block text-sm font-medium text-gray-700 font-poppins">
          {{ csT('$contact.whatsapp.label') }}?
          <span class="text-red-500">*</span>
        </label>
          <div class="flex items-center gap-2">
            <Button
              type="button"
              class="h-6 w-16 text-xs"
              :variant="localFormData.onWhatsapp === true ? 'default' : 'outline'"
              @click="localFormData.onWhatsapp = true"
              :class="localFormData.onWhatsapp === true ? 'bg-green-500 hover:bg-green-600 text-white' : ''"
            >
              {{ csT('$contact.whatsapp.yes') }}
            </Button>
            <Button
              type="button"
              class="h-6 w-16 text-xs"
              :variant="localFormData.onWhatsapp === false ? 'default' : 'outline'"
              @click="localFormData.onWhatsapp = false"
              :class="localFormData.onWhatsapp === false ? 'bg-gray-500 hover:bg-gray-600 text-white' : ''"
            >
              {{ csT('$contact.whatsapp.no') }}
            </Button>
          </div>
      </div>
      <p v-if="errors.onWhatsapp" class="text-red-500 text-sm mt-1 font-poppins">{{ errors.onWhatsapp }}</p>
      <div class="flex items-start gap-3">
        <input
          id="dataSharingConsent"
          type="checkbox"
          v-model="localFormData.dataSharingConsent"
          class="mt-1 h-4 w-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400"
        />
        <div>
          <label for="dataSharingConsent" class="text-sm text-gray-700 font-poppins leading-5">
            {{ csT('$contact.dataSharingConsent.label') }}
            <span class="text-red-500">*</span>
          </label>
          <p class="text-sm text-gray-500 font-poppins leading-5 whitespace-pre-line">
            {{ csT('$contact.dataSharingConsent.description') }}
          </p>
        </div>
      </div>
      <p v-if="errors.dataSharingConsent" class="text-red-500 text-sm mt-1 font-poppins">{{ errors.dataSharingConsent }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
const { t: csT } = useMessages('case-submit')

interface FormData {
  fullName: string
  email: string
  mobile: string
  onWhatsapp: boolean | null
  dataSharingConsent: boolean
}

interface Errors {
  fullName?: string
  email?: string
  mobile?: string
  onWhatsapp?: string
  dataSharingConsent?: string
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

watch(localFormData, (newData) => {
  emit('update:formData', newData)
}, { deep: true })

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const isValidPhoneNumber = (mobile: string): boolean => {
  const digitsOnly = String(mobile || '').replace(/\D/g, '')
  return digitsOnly.length >= 7
}

watch(localFormData, () => {
  validate()
}, { deep: true })

const validate = (): boolean => {
  const newErrors: Errors = {}
  
  if (!localFormData.value.fullName?.trim()) {
    newErrors.fullName = csT('$contact.fullName.required')
  } else if (localFormData.value.fullName.trim().length < 3) {
    newErrors.fullName = csT('$contact.fullName.minLength')
  }
  
  if (localFormData.value.onWhatsapp === false) {
    if (!localFormData.value.email?.trim()) {
      newErrors.email = csT('$contact.email.required')
    } else if (!isValidEmail(localFormData.value.email)) {
      newErrors.email = csT('$contact.email.invalid')
    }
  } else if (localFormData.value.email?.trim() && !isValidEmail(localFormData.value.email)) {
    newErrors.email = csT('$contact.email.invalid')
  }
  
  if (!localFormData.value.mobile?.trim()) {
    newErrors.mobile = csT('$contact.mobile.required')
  } else if (!isValidPhoneNumber(localFormData.value.mobile)) {
    newErrors.mobile = csT('$contact.mobile.invalid')
  }
  
  if (localFormData.value.onWhatsapp === null) {
    newErrors.onWhatsapp = csT('$contact.whatsapp.required')
  }

  if (!localFormData.value.dataSharingConsent) {
    newErrors.dataSharingConsent = csT('$contact.dataSharingConsent.required')
  }
  
  errors.value = newErrors
  return Object.keys(newErrors).length === 0
}

defineExpose({ validate })
</script>
