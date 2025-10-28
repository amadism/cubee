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
    message.value = 'Missing parameters.'
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
    message.value = 'Invalid or already claimed.'
  } else if (data.value?.success) {
    isError.value = false
    message.value = 'Case successfully claimed!'
    successOpen.value = true
  } else {
    isError.value = true
    isClaimed.value = true
    message.value = 'Invalid or already claimed.'
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
  <h1 v-if="error && !gettingData">invalid link</h1>
  <p v-if="gettingData">loading...</p>
  <h1 v-if="gettingDataError && !caseData">You are not authorized to claim this case.</h1>
  <div v-if="!gettingDataError && !gettingData" class="mx-auto mt-16 max-w-6xl px-4">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Left Section: Terms Confirmation -->
      <Card class="bg-yellow-50 border-yellow-400 border">
        <CardHeader>
          <CardTitle class="text-xl text-yellow-800">
            <span class="block mb-2">📋 Terms & Conditions Agreement</span>
            <span class="text-sm font-normal text-yellow-700">Nutzungsbedingungen und Vereinbarung</span>
          </CardTitle>
          <CardDescription v-if="!successOpen" class="text-yellow-700">
            Bitte bestätigen Sie die Annahme unserer Bedingungen.
            <br>
            Please confirm your acceptance of our terms.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Transition
            enter-active-class="transition-opacity duration-300"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
          >
            <div v-if="showConfirm && !successOpen" class="space-y-4">
              <div class="bg-white p-4 rounded-lg border border-yellow-200">
                <h4 class="font-semibold text-yellow-800 mb-2">🇩🇪 German:</h4>
                <p class="text-sm leading-relaxed text-gray-700">
                  Mit der Annahme des Falls erkennen Sie an, dass die angegebenen Vermittlungskosten im Falle der Erstellung eines Gutachtens in Rechnung gestellt werden. Sie bestätigen, dass Sie unsere Geschäftsbedingungen gelesen und verstanden haben.
                </p>
              </div>
            </div>
          </Transition>
        </CardContent>
        <CardFooter v-if="!successOpen" class="flex gap-3 justify-end">
          <Button :disabled="loading || isClaimed" variant="secondary" class="w-full" @click="rejectClaim">Reject</Button>
          <Button :disabled="loading || isClaimed" variant="primary" class="w-full" @click="acceptClaim">
            {{ loading ? 'Processing…' : 'Accept Terms & Claim' }}
          </Button>
        </CardFooter>
      </Card>

      <!-- Right Section: Case Information -->
      <Card class="bg-blue-50 border-blue-400 border h-fit">
        <CardHeader>
          <CardTitle class="text-xl text-blue-800 flex items-center gap-2">
            <span>📋</span>
            Case Information
          </CardTitle>
          <CardDescription class="text-blue-700">
            Details des zu bearbeitenden Falls / Case details to be processed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div v-if="caseData && Object.keys(caseData).length > 0" class="space-y-4">
            <!-- Report Type -->
            <div class="bg-white p-4 rounded-lg border border-blue-200">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-lg">🔧</span>
                <h4 class="font-semibold text-blue-800">Report Type / Art des Berichts</h4>
              </div>
              <p class="text-sm text-gray-700 capitalize">{{ (caseData as any).report_type || 'N/A' }}</p>
            </div>

            <!-- Vehicle Information -->
            <div class="bg-white p-4 rounded-lg border border-blue-200">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-lg">🚗</span>
                <h4 class="font-semibold text-blue-800">Vehicle / Fahrzeug</h4>
              </div>
              <p class="text-sm text-gray-700">{{ (caseData as any).vehicle_make_model || 'N/A' }}</p>
            </div>

            <!-- Location -->
            <!-- <div class="bg-white p-4 rounded-lg border border-blue-200">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-lg">📍</span>
                <h4 class="font-semibold text-blue-800">Location / Standort</h4>
              </div>
              <p class="text-sm text-gray-700">{{ (caseData as any).location_name || 'N/A' }}</p>
            </div> -->
          </div>
          
          <div v-else class="text-center py-8 text-gray-500">
            <span class="text-4xl mb-2 block">📋</span>
            <p>No case data available</p>
            <p class="text-xs mt-1">Keine Falldaten verfügbar</p>
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
      <div v-if="message && !data?.success" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div class="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-400 rounded-xl shadow-2xl p-8 max-w-xl w-full m-4 text-center">
          <!-- Error Icon -->
          <div class="mb-2">
            <div class="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
              <span class="text-4xl">😢</span>
            </div>
            <div class="inline-flex items-center justify-center w-16 h-16 bg-red-200 rounded-full -ml-4 -mt-2">
              <span class="text-3xl">❌</span>
            </div>
          </div>
          <p class="text-red-800 mb-4">
            Sorry, This case is already claimed.
            <br>
            Sorry, Dieser Fall ist bereits beansprucht.
          </p>
          <Button variant="primary" class="w-full" @click="router.push('/')">Okay, got it!</Button>
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
      <div v-if="successOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <Transition
          enter-active-class="transition-all duration-500"
          enter-from-class="opacity-0 scale-75"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-300"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="successOpen" class="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-400 rounded-xl shadow-2xl p-8 max-w-3xl w-full m-4">
            <div class="text-center">
              <!-- Success Icon -->
              <div class="mb-2">
                <div class="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                  <span class="text-4xl">🎉</span>
                </div>
                <div class="inline-flex items-center justify-center w-16 h-16 bg-green-200 rounded-full -ml-4 -mt-2">
                  <span class="text-3xl">✅</span>
                </div>
              </div>

              <!-- Main Success Message -->
              <h2 class="text-2xl font-bold text-green-800 mb-4">
                🏆 Case Successfully Claimed! 🏆
              </h2>
              
              <div class="space-y-4 mb-6">
                <!-- German Message -->
                <div class="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                  <h3 class="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    🇩🇪 <span>Herzlichen Glückwunsch!</span>
                  </h3>
                  <p class="text-sm text-gray-700 leading-relaxed text-left">
                    Sie haben erfolgreich diesen Fall übernommen! Dies ist ein wichtiger Meilenstein für Ihre Karriere. Wir freuen uns auf die Zusammenarbeit und sind überzeugt, dass Sie hervorragende Arbeit leisten werden.
                  </p>
                </div>

                <!-- English Message -->
                <div class="bg-white p-4 rounded-lg border border-green-200 shadow-sm">
                  <h3 class="font-semibold text-green-800 mb-2 flex items-center gap-2">
                    🇬🇧 <span>Congratulations!</span>
                  </h3>
                  <p class="text-sm text-gray-700 leading-relaxed text-left">
                    You have successfully claimed this case! This is a significant milestone for your career. We look forward to working with you and are confident that you will deliver exceptional work.
                  </p>
                </div>
              </div>

              <!-- Additional Success Details -->
              <div class="bg-green-100 p-4 rounded-lg border border-green-300 mb-6">
                <p class="text-sm text-green-800 font-medium">
                  🎯 Case ID: <span class="font-mono bg-white px-2 py-1 rounded">{{ caseId }}</span>
                </p>
                <p class="text-xs text-green-700 mt-2">
                  You will receive further instructions via email and whatsapp shortly.
                </p>
                <p class="text-xs text-green-700">
                  Sie erhalten in Kürze weitere Anweisungen per E-Mail und WhatsApp.
                </p>
              </div>

              <!-- Action Button -->
              <div class="flex justify-center">
                <Button 
                  variant="primary" 
                  class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-200" 
                  @click="goHome"
                >
                  🚀 Okay, got it!
                </Button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>
