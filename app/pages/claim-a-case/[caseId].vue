<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  title: 'Fall beanspruchen',
})

import { onMounted, ref } from 'vue'
import { useRoute, useFetch, useRouter } from '#app'

const route = useRoute()
const router = useRouter()

const caseId = ref(route.params.caseId)
const partnerId = ref(route.query.id)
const claimCode = route.query.code

const loading = ref(false)
const message = ref('')
const isError = ref(false)
const successOpen = ref(false)
const showConfirm = ref(false)
const isClaimed = ref(false)
const caseData = ref<{
  report_type?: string
  vehicle_make_model?: string
  location_name?: string
  tel?: string
  detailed_information?: string
  partner_name?: string
  partner_tel?: string
}>({})
const gettingData = ref(true)
const gettingDataError = ref(false)

const { data, error } = await useFetch('/api/cases/check-proposal', {
  method: 'POST',
  body: {
    caseId: route.params.caseId,
    partnerId: route.query.id,
  },
})

onMounted(async () => {
  caseData.value = data.value?.[0] || {}
  if (error.value || Object.keys(caseData.value).length === 0) {
    gettingDataError.value = true
  } else {
    gettingDataError.value = false
  }
  gettingData.value = false
  showConfirm.value = true
})


async function acceptClaim() {
  if (!caseId || !partnerId || !claimCode) {
    isError.value = true
    message.value = 'Es fehlen erforderliche Angaben.'
    return
  }
  loading.value = true
  const { data, error } = await useFetch('/api/cases/claim', {
    method: 'POST',
    body: {
      case_id: caseId,
      partner_id: partnerId,
      code: claimCode,
      caseData: caseData.value
    },
  })

  loading.value = false

  if (error.value || !data.value?.success) {
    isError.value = true
    isClaimed.value = true
    message.value = 'Dieser Fall wurde bereits übernommen oder ist ungültig.'
  } else if (data.value?.success) {
    isError.value = false
    message.value = 'Fall erfolgreich übernommen!'
    successOpen.value = true
  } else {
    isError.value = true
    isClaimed.value = true
    message.value = 'Dieser Fall wurde bereits übernommen oder ist ungültig.'
  }
}

function rejectClaim() {
  router.push('/')
}

function goHome() {
  successOpen.value = false
  router.push('/')
}
</script>

<template>
  <h1 v-if="error && !gettingData" class="text-center px-4 py-8 text-lg sm:text-xl">Ungültiger Link
  </h1>
  <p v-if="gettingData" class="text-center px-4 py-8">Lade Daten…</p>
  <h1 v-if="gettingDataError && !caseData" class="text-center px-4 py-8 text-lg sm:text-xl">Sie sind nicht berechtigt, diesen Fall zu übernehmen.
  </h1>
  <div v-if="!gettingDataError && !gettingData" class="mx-auto mt-8 sm:mt-16 max-w-6xl px-2 sm:px-4">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
      <!-- Left Section: Terms Confirmation -->
      <Card class="bg-yellow-50 border-yellow-400 border">
        <CardHeader class="p-4 sm:p-6">
          <CardTitle class="text-lg sm:text-xl text-yellow-800">
            Nutzungsbedingungen und Vereinbarung
          </CardTitle>
          <CardDescription v-if="!successOpen" class="text-yellow-700 text-xs sm:text-sm">
            Bitte lesen Sie die nachstehenden Bedingungen sorgfältig durch und bestätigen Sie Ihre Entscheidung.
          </CardDescription>
        </CardHeader>
        <CardContent class="px-4 sm:px-6">
          <Transition
            enter-active-class="transition-opacity duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
          >
            <div v-if="showConfirm && !successOpen" class="space-y-4">
              <div class="bg-white p-3 sm:p-4 rounded-lg border border-yellow-200">
                <p class="text-xs leading-relaxed text-gray-700 whitespace-pre-line">
                  Die Informationen zu dem Fall finden Sie in der gezeigten Übersicht.
                  <br>
                  <br>
                  Bitte entscheiden Sie durch das Anklicken der Schaltfläche, ob Sie den Fall zu den folgenden
                  Bedingungen annehmen oder ablehnen möchten:
                  <br>
                  <br>
                  Die Übernahme des Falls ist zu einem Pauschalbetrag von 249€ netto möglich. Die Bearbeitung sowie
                  das aus dem Gutachten resultierende Honorar liegen anschließend vollständige bei Ihnen. Sollte es
                  bei dem vermittelten Fall unverschuldet zu keinem Abschluss bei der Gutachtenerstellung kommen,
                  wird der Rechnungsbetrag erlassen.
                </p>
              </div>
            </div>
          </Transition>
        </CardContent>
        <CardFooter v-if="!successOpen" class="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end px-4 sm:px-6">
          <Button :disabled="loading || isClaimed" variant="secondary" class="w-full sm:w-auto" @click="rejectClaim">Ablehnen</Button>
          <Button :disabled="loading || isClaimed" variant="primary" class="w-full sm:w-auto text-sm sm:text-base" @click="acceptClaim">
            {{ loading ? 'Wird verarbeitet…' : 'Fall annehmen' }}
          </Button>
        </CardFooter>
      </Card>

      <!-- Right Section: Case Information -->
      <Card class="bg-blue-50 border-blue-400 border h-fit">
        <CardHeader class="p-4 sm:p-6">
          <CardTitle class="text-lg sm:text-xl text-blue-800">
            Falldetails
          </CardTitle>
          <CardDescription class="text-blue-700 text-xs sm:text-sm">
            Überblick über die wichtigsten Informationen zum Fall
          </CardDescription>
        </CardHeader>
        <CardContent class="p-4 sm:p-6">
          <div v-if="caseData && Object.keys(caseData).length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-2">
            <!-- Report Type -->
            <div class="bg-white p-3 sm:p-2 rounded-lg border border-blue-200">
              <h4 class="font-semibold text-blue-800 text-sm md:text-base mb-2">Berichtsart</h4>
              <p class="text-xs text-gray-700 capitalize">{{ (caseData as any).report_type || 'N/A' }}</p>
            </div>

            <!-- Vehicle Information -->
            <div class="bg-white p-3 sm:p-2 rounded-lg border border-blue-200">
              <h4 class="font-semibold text-blue-800 text-sm mb-2">Fahrzeug</h4>
              <p class="text-xs text-gray-700">{{ (caseData as any).vehicle_make_model || 'N/A' }}</p>
            </div>

            <!-- Location -->
            <div class="bg-white p-3 sm:p-2 rounded-lg border border-blue-200">
              <h4 class="font-semibold text-blue-800 mb-2">Standort</h4>
              <p class="text-xs text-gray-700">{{ (caseData as any).location_name || 'N/A' }}</p>
            </div>

            <!-- Zuordnung -->
            <div v-if="(caseData as any).zuordnung" class="bg-white p-3 sm:p-2 rounded-lg border border-blue-200">
              <h4 class="font-semibold text-blue-800 text-sm mb-2">Zuordnung</h4>
              <p class="text-xs text-gray-700">{{ (caseData as any).zuordnung }}</p>
            </div>

            <!-- Kilometerstand -->
            <div v-if="(caseData as any).mileage" class="bg-white p-3 sm:p-2 rounded-lg border border-blue-200">
              <h4 class="font-semibold text-blue-800 text-sm mb-2">Kilometerstand</h4>
              <p class="text-xs text-gray-700">{{ (caseData as any).mileage }}</p>
            </div>

            <!-- Vorschäden -->
            <div v-if="(caseData as any).previous_damage" class="bg-white p-3 sm:p-2 rounded-lg border border-blue-200">
              <h4 class="font-semibold text-blue-800 text-sm mb-2">Vorschäden</h4>
              <p class="text-xs sm:text-sm text-gray-700 capitalize">{{ (caseData as any).previous_damage }}</p>
            </div>

            <!-- Baujahr -->
            <div v-if="(caseData as any).manuf_year" class="bg-white p-3 sm:p-2 rounded-lg border border-blue-200">
              <h4 class="font-semibold text-blue-800 text-sm mb-2">Baujahr</h4>
              <p class="text-xs text-gray-700">{{ (caseData as any).manuf_year }}</p>
            </div>
          </div>

          
          <div v-else class="text-center py-8 text-gray-500">
            <p class="text-sm sm:text-base">Keine Falldaten verfügbar.</p>
          </div>
        </CardContent>
      </Card>
    </div>

    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="message && !data?.success" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <div class="bg-white border border-red-300 rounded-xl shadow-xl p-4 sm:p-6 max-w-xl w-full text-center">
          <p class="text-sm sm:text-base text-red-700 mb-4">
            {{ message }}
          </p>
          <Button variant="primary" class="w-full text-sm sm:text-base" @click="router.push('/')">Zurück zur Übersicht</Button>
        </div>
      </div>
    </Transition>

    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="successOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
        <Transition
          enter-active-class="transition-all duration-500"
          enter-from-class="opacity-0 scale-75"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-300"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="successOpen" class="bg-white border border-green-300 rounded-xl shadow-xl p-4 sm:p-6 max-w-2xl w-full">
            <div class="text-center space-y-4">
              <h2 class="text-xl sm:text-2xl font-bold text-green-700">
                Herzlichen Glückwunsch!
              </h2>
              <p class="text-sm sm:text-base text-gray-700 leading-relaxed">
                Sie haben diesen Fall erfolgreich übernommen.
              </p>
              <p class="text-sm text-green-700">
                Fall-ID: <span class="font-mono bg-green-50 px-2 py-1 rounded">{{ caseId }}</span>
              </p>
              <p class="text-sm">
                Wir freuen uns auf die Zusammenarbeit.
Die weiteren Informationen zu diesem Fall erhalten Sie in Kürze per E-Mail oder WhatsApp.
              </p>
              <Button 
                variant="primary" 
                class="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg" 
                @click="goHome"
              >
                Zur Übersicht
              </Button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>
