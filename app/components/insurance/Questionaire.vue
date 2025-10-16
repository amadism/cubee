<script setup lang="ts">
import {
  faAddressCard,
  faLock,
  faPercent,
  faQuestion,
  faUser,
} from '@fortawesome/pro-solid-svg-icons'

defineProps({
  iconColor: {
    type: String,
    default: 'black',
  },
  accentColor: {
    type: String,
    default: 'black',
  },
})

const { t } = useMessages('insurance')

type AccidentCauserId = 'me' | 'other' | 'unknown'

// Define the possible accident causers with proper typing
const accidentCausers = [
  { id: 'me' as AccidentCauserId, icon: faUser },
  { id: 'other' as AccidentCauserId, icon: faAddressCard },
  { id: 'unknown' as AccidentCauserId, icon: faQuestion },
]

// Add reactive state for selected causer
const selectedCauser = ref<AccidentCauserId | null>(null)

// Form refs for scrolling
const meFormRef = ref<HTMLElement | null>(null)
const otherFormRef = ref<HTMLElement | null>(null)

// Form data
const salutation = ref('')
const firstName = ref('')
const lastName = ref('')
const email = ref('')
const phone = ref('')
const location = ref('')
const description = ref('')
const agreeToTerms = ref(false)

// Type assertion for translation keys
function getTranslationKey(key: AccidentCauserId) {
  return `accidentCauser.${key}` as const
}

// Type-safe translation function for form keys
function getFormTranslation(key: string) {
  return t(`form.${key}` as any)
}

// Handle causer selection with scrolling
function selectCauser(causerId: AccidentCauserId) {
  selectedCauser.value = causerId

  // Wait for DOM update before scrolling
  nextTick(() => {
    let targetElement: HTMLElement | null = null

    if (causerId === 'me') {
      targetElement = meFormRef.value
    } else if (causerId === 'other' || causerId === 'unknown') {
      targetElement = otherFormRef.value
    }

    if (targetElement) {
      setTimeout(() => {
        targetElement?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    }
  })
}

// Handle form submission
function handleSubmit() {
  // TODO: Implement form submission logic here
  // This should send the form data to the appropriate API endpoint
  // Form data available:
  // - salutation.value
  // - firstName.value
  // - lastName.value
  // - email.value
  // - phone.value
  // - location.value
  // - description.value
  // - agreeToTerms.value
}
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-8">
    <h1 class="mb-8 text-center text-2xl font-bold">
      {{ t('accidentCauser.title') }}
    </h1>

    <div class="mx-auto grid max-w-4xl grid-cols-1 gap-4 lg:grid-cols-3">
      <button
        v-for="causer in accidentCausers"
        :key="causer.id"
        class="group rounded-lg border p-4 text-center transition-colors hover:border-gray-400 hover:shadow-sm md:py-8"
        :class="{
          'border-2': selectedCauser === causer.id,
        }"
        :style="{
          borderColor: selectedCauser === causer.id ? accentColor : '',
        }"
        @click="selectCauser(causer.id)"
      >
        <div class="mb-3 flex justify-center">
          <Icon
            :icon="causer.icon"
            class="text-6xl transition-opacity group-hover:!opacity-100"
            :class="selectedCauser === causer.id ? 'opacity-100' : 'opacity-50'"
            :style="{
              color: iconColor,
            }"
          />
        </div>
        <p :class="{ 'font-semibold': selectedCauser === causer.id }">
          {{ t(getTranslationKey(causer.id)) }}
        </p>
      </button>
    </div>

    <!-- Contact Form -->
    <div
      v-if="selectedCauser === 'unknown' || selectedCauser === 'other'"
      ref="otherFormRef"
      class="mt-12 pt-8 md:pt-12"
    >
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="mb-4 whitespace-pre-line text-2xl font-bold">
          {{
            selectedCauser === 'other'
              ? getFormTranslation('otherTitle')
              : getFormTranslation('title')
          }}
        </h2>
        <p class="mb-8 whitespace-pre-line">
          {{
            selectedCauser === 'other'
              ? getFormTranslation('otherSubtitle')
              : getFormTranslation('subtitle')
          }}
        </p>
      </div>

      <form class="mx-auto max-w-2xl" @submit.prevent="handleSubmit">
        <!-- Salutation -->
        <select
          v-model="salutation"
          class="mb-4 w-full rounded-lg border bg-white p-3"
          :placeholder="getFormTranslation('salutation')"
        >
          <option value="" disabled selected>
            {{ getFormTranslation('salutation') }}
          </option>
          <option value="mr">Herr</option>
          <option value="mrs">Frau</option>
          <option value="other">Divers</option>
        </select>

        <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <!-- First Name -->
          <input
            v-model="firstName"
            type="text"
            :placeholder="getFormTranslation('firstName')"
            class="rounded-lg border bg-white p-3"
          />

          <!-- Last Name -->
          <input
            v-model="lastName"
            type="text"
            :placeholder="getFormTranslation('lastName')"
            class="rounded-lg border bg-white p-3"
          />
        </div>

        <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <!-- Email -->
          <input
            v-model="email"
            type="email"
            :placeholder="getFormTranslation('email')"
            class="rounded-lg border bg-white p-3"
          />

          <!-- Phone -->
          <input
            v-model="phone"
            type="tel"
            :placeholder="getFormTranslation('phone')"
            class="rounded-lg border bg-white p-3"
          />
        </div>

        <!-- Location -->
        <input
          v-model="location"
          type="text"
          :placeholder="getFormTranslation('location')"
          class="mb-4 w-full rounded-lg border bg-white p-3"
        />

        <!-- Description -->
        <textarea
          v-model="description"
          :placeholder="getFormTranslation('description')"
          class="mb-4 h-40 w-full rounded-lg border bg-white p-3"
        ></textarea>

        <!-- Privacy Notice -->
        <div class="mb-6">
          <label class="flex items-start gap-2">
            <input
              v-model="agreeToTerms"
              type="checkbox"
              class="mt-1"
              required
            />
            <span class="text-sm">
              {{ getFormTranslation('privacyNotice') }}
            </span>
          </label>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="mb-6 w-full rounded-lg bg-gray-800 px-6 py-3 text-white transition-colors hover:bg-gray-700"
        >
          {{ getFormTranslation('submit') }}
        </button>

        <!-- Footer -->
        <div class="flex items-center justify-between text-sm text-gray-600">
          <div class="flex items-center gap-2">
            <Icon :icon="faLock" />
            {{ getFormTranslation('ssl') }}
          </div>
          <div class="flex items-center gap-2">
            <Icon :icon="faPercent" />
            {{ getFormTranslation('free') }}
          </div>
        </div>
      </form>
    </div>

    <!-- Form for when the user caused the accident -->
    <div
      v-if="selectedCauser === 'me'"
      ref="meFormRef"
      class="mt-12 pt-8 md:pt-12"
    >
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="mb-4 whitespace-pre-line text-2xl font-bold">
          {{ getFormTranslation('meTitle') }}
        </h2>
        <p class="mb-8 whitespace-pre-line">
          {{ getFormTranslation('meSubtitle') }}
        </p>
      </div>

      <form class="mx-auto max-w-2xl" @submit.prevent="handleSubmit">
        <!-- Salutation -->
        <select
          v-model="salutation"
          class="mb-4 w-full rounded-lg border bg-white p-3"
          :placeholder="getFormTranslation('salutation')"
        >
          <option value="" disabled selected>
            {{ getFormTranslation('salutation') }}
          </option>
          <option value="mr">Herr</option>
          <option value="mrs">Frau</option>
          <option value="other">Divers</option>
        </select>

        <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <!-- First Name -->
          <input
            v-model="firstName"
            type="text"
            :placeholder="getFormTranslation('firstName')"
            class="rounded-lg border bg-white p-3"
          />

          <!-- Last Name -->
          <input
            v-model="lastName"
            type="text"
            :placeholder="getFormTranslation('lastName')"
            class="rounded-lg border bg-white p-3"
          />
        </div>

        <div class="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <!-- Email -->
          <input
            v-model="email"
            type="email"
            :placeholder="getFormTranslation('email')"
            class="rounded-lg border bg-white p-3"
          />

          <!-- Phone -->
          <input
            v-model="phone"
            type="tel"
            :placeholder="getFormTranslation('phone')"
            class="rounded-lg border bg-white p-3"
          />
        </div>

        <!-- Location -->
        <input
          v-model="location"
          type="text"
          :placeholder="getFormTranslation('location')"
          class="mb-4 w-full rounded-lg border bg-white p-3"
        />

        <!-- Description -->
        <textarea
          v-model="description"
          :placeholder="getFormTranslation('description')"
          class="mb-4 h-40 w-full rounded-lg border bg-white p-3"
        ></textarea>

        <!-- Privacy Notice -->
        <div class="mb-6">
          <label class="flex items-start gap-2">
            <input
              v-model="agreeToTerms"
              type="checkbox"
              class="mt-1"
              required
            />
            <span class="text-sm">
              {{ getFormTranslation('privacyNotice') }}
            </span>
          </label>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="mb-6 w-full rounded-lg bg-gray-800 px-6 py-3 text-white transition-colors hover:bg-gray-700"
        >
          {{ getFormTranslation('submit') }}
        </button>

        <!-- Footer -->
        <div class="flex items-center justify-between text-sm text-gray-600">
          <div class="flex items-center gap-2">
            <Icon :icon="faLock" />
            {{ getFormTranslation('ssl') }}
          </div>
          <div class="flex items-center gap-2">
            <Icon :icon="faPercent" />
            {{ getFormTranslation('free') }}
          </div>
        </div>
      </form>
    </div>
  </div>
</template>
