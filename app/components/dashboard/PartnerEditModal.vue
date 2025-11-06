<template>
  <Teleport to="body">
    <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="open" class="fixed inset-0 z-[1000] backdrop-blur-sm">
        <div class="absolute inset-0 bg-black/40" @click="emit('update:open', false)" />
        <div class="absolute inset-0 grid place-items-center p-4">
          <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 translate-y-2 sm:translate-y-0 sm:scale-95" enter-to-class="opacity-100 translate-y-0 sm:scale-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 translate-y-0 sm:scale-100" leave-to-class="opacity-0 translate-y-2 sm:translate-y-0 sm:scale-95">
            <div v-if="open" class="relative w-full max-h-[90dvh] max-w-2xl rounded-lg bg-white shadow-lg overflow-hidden mx-2 sm:mx-0">
              <button class="absolute right-2 sm:right-4 top-2 sm:top-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md border bg-white hover:bg-gray-50 shadow-sm" aria-label="Close" @click="emit('update:open', false)">
                <span class="text-xl leading-none">×</span>
              </button>
              <div class="p-4 sm:p-6 space-y-3 sm:space-y-4 overflow-y-auto max-h-[90dvh]">
                <h2 class="text-lg sm:text-xl font-semibold">{{ props.mode === 'review' ? 'Review this Request' : 'Edit Partner' }}</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs uppercase text-gray-500 mb-1">Name</label>
                    <input v-model="form.name" @blur="validateName()" :class="['w-full border rounded-md px-3 py-2 text-sm', errors.name ? 'border-red-500' : '']" type="text" />
                    <p v-if="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name }}</p>
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-gray-500 mb-1">Email</label>
                    <input v-model="form.email" @blur="validateEmail()" :class="['w-full border rounded-md px-3 py-2 text-sm', errors.email ? 'border-red-500' : '']" type="email" />
                    <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email }}</p>
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-gray-500 mb-1">Tel</label>
                    <input v-model="form.tel" @blur="validateTel()" :class="['w-full border rounded-md px-3 py-2 text-sm', errors.tel ? 'border-red-500' : '']" type="text" />
                    <p v-if="errors.tel" class="text-xs text-red-600 mt-1">{{ errors.tel }}</p>
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-gray-500 mb-1">Note</label>
                    <input v-model="form.note" :class="['w-full border rounded-md px-3 py-2 text-sm']" type="text" placeholder="Optional note" />
                  </div>
                  <div class="col-span-1 md:col-span-2">
                    <label class="block text-xs uppercase text-gray-500 mb-1">Postal Code</label>
                    <div class="flex items-center gap-2">
                      <input v-model="form.zip" :class="['w-full border rounded-md px-3 py-2 text-sm', zipError ? 'border-red-500' : '']" type="text" placeholder="e.g. 10115" />
                      <Button type="button" class="p-2 rounded-md text-sm bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50" :disabled="isZipLoading || !form.zip" @click="updateLocationFromZip">
                        {{ isZipLoading ? 'Updating…' : 'Update Location' }}
                      </Button>
                    </div>
                    <p v-if="zipError" class="text-xs text-red-600 mt-1">{{ zipError }}</p>
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-gray-500 mb-1">Location Name</label>
                    <input v-model="form.location_name" @blur="validateLocationName()" :class="['w-full border rounded-md px-3 py-2 text-sm', errors.location_name ? 'border-red-500' : '']" type="text" />
                    <p v-if="errors.location_name" class="text-xs text-red-600 mt-1">{{ errors.location_name }}</p>
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-gray-500 mb-1">Longitude</label>
                    <input v-model.number="form.lon" @blur="validateLon()" :class="['w-full border rounded-md px-3 py-2 text-sm', errors.lon ? 'border-red-500' : '']" type="number" step="any" />
                    <p v-if="errors.lon" class="text-xs text-red-600 mt-1">{{ errors.lon }}</p>
                  </div>
                  <div>
                    <label class="block text-xs uppercase text-gray-500 mb-1">Latitude</label>
                    <input v-model.number="form.lat" @blur="validateLat()" :class="['w-full border rounded-md px-3 py-2 text-sm', errors.lat ? 'border-red-500' : '']" type="number" step="any" />
                    <p v-if="errors.lat" class="text-xs text-red-600 mt-1">{{ errors.lat }}</p>
                  </div>
                </div>
                <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2">
                  <Button variant="outline" @click="emit('update:open', false)" class="w-full sm:w-auto text-sm sm:text-base">Cancel</Button>
                  <Button :disabled="saving || !isValid" @click="save" class="bg-emerald-500 hover:bg-emerald-600 text-white w-full sm:w-auto text-sm sm:text-base">{{ saving ? 'Saving...' : (props.mode === 'review' ? 'Approve this Partner' : 'Save Changes') }}</Button>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
  
</template>

<script setup>
import { Button } from '@/components/ui/button'
import { useZipLocation } from '@/composables/useZipLocation'

const props = defineProps({
  open: { type: Boolean, default: false },
  item: { type: Object, default: null },
  mode: { type: String, default: 'edit' },
})

const emit = defineEmits(['update:open', 'saved'])

const saving = ref(false)

const form = reactive({
  name: '',
  email: '',
  tel: '',
  zip: '',
  lon: null,
  lat: null,
  location_name: '',
  note: '',
})

watch(() => props.item, (val) => {
  if (val) {
    form.name = val.name || ''
    form.email = val.email || ''
    form.tel = val.tel || ''
    form.zip = val.zip || ''
    form.lon = val.lon ?? null
    form.lat = val.lat ?? null
    form.location_name = val.location_name || ''
    form.note = val.note || ''
  } else {
    reset()
  }
}, { immediate: true })

function reset() {
  form.name = ''
  form.email = ''
  form.tel = ''
  form.zip = ''
  form.lon = null
  form.lat = null
  form.location_name = ''
  form.note = ''
}

const errors = reactive({
  name: '',
  email: '',
  tel: '',
  zip: '',
  lon: '',
  lat: '',
  location_name: '',
})

function validateName() {
  if (!form.name || form.name.trim().length < 5) {
    errors.name = 'Name must be at least 5 characters'
  } else {
    errors.name = ''
  }
}

function validateEmail() {
  const value = (form.email || '').trim()
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  errors.email = value === '' ? '' : (re.test(value) ? '' : 'Enter a valid email address')
}

function validateTel() {
  const normalized = String(form.tel ?? '').replace(/[\s\-()]/g, '')
  const re = /^\+49[1-9]\d{6,12}$/
  errors.tel = re.test(normalized) ? '' : 'Enter a valid phone number like +491512345678'
}

function validateZip() {
  const value = (form.zip || '').trim()
  errors.zip = value === '' ? '' : (/^\d{5}$/.test(value) ? '' : 'Enter a valid 5-digit ZIP')
}

function validateLon() {
  const v = form.lon
  errors.lon = (typeof v === 'number' && Number.isFinite(v)) ? '' : 'Longitude must be a number'
}

function validateLat() {
  const v = form.lat
  errors.lat = (typeof v === 'number' && Number.isFinite(v)) ? '' : 'Latitude must be a number'
}

function validateLocationName() {
  const value = (form.location_name || '').trim()
  errors.location_name = value ? '' : 'Location name is required'
}

const isValid = computed(() => {
  const nameOk = !!form.name && form.name.trim().length >= 5
  const emailOk = (() => {
    const value = (form.email || '').trim()
    if (value === '') return true
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(value)
  })()
  const telOk = (() => {
    const normalized = String(form.tel ?? '').replace(/[\s\-()]/g, '')
    const re = /^\+49[1-9]\d{6,12}$/
    return re.test(normalized)
  })()
  const lonOk = typeof form.lon === 'number' && Number.isFinite(form.lon)
  const latOk = typeof form.lat === 'number' && Number.isFinite(form.lat)
  const locOk = !!(form.location_name || '').trim()
  return nameOk && emailOk && telOk && lonOk && latOk && locOk
})

function runAllValidations() {
  validateName(); validateEmail(); validateTel(); validateZip(); validateLon(); validateLat(); validateLocationName()
}

// ZIP to location integration
const { isLoading: isZipLoadingRef, error: zipErrorRef, getLocationByZip } = useZipLocation()
const isZipLoading = computed(() => isZipLoadingRef.value)
const zipError = computed(() => zipErrorRef.value)

async function updateLocationFromZip() {
  validateZip()
  if (errors.zip) return
  const result = await getLocationByZip(form.zip)
  if (result) {
    form.lat = result.lat
    form.lon = result.lon
    form.location_name = result.location_name || form.location_name
    validateLat(); validateLon(); validateLocationName()
  }
}

async function save() {
  try {
    saving.value = true
    if (!isValid.value) {
      runAllValidations()
      if (!isValid.value) return
    }
    await $fetch(`/api/partners/${props.item?.id}`, { method: 'PUT', body: {
      name: form.name,
      email: form.email || null,
      tel: form.tel,
      zip: form.zip || null,
      lon: form.lon,
      lat: form.lat,
      location_name: form.location_name,
      note: form.note || null,
      ...(props.mode === 'review' ? { status: 'active' } : {}),
    }})
    emit('saved')
    emit('update:open', false)
  } catch (e) {
    console.error(e)
  } finally {
    saving.value = false
  }
}
</script>


