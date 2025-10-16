<script lang="ts" setup>
import CustomLocation from '~/components/appointment/location-selection/CustomLocation.vue'

definePageMeta({
  middleware: ['i18n:messages'],
  messages: ['contact'],
})

defineI18nRoute({
  paths: {
    de: '/kontakt',
  },
})

const { t: contactT } = useMessages('contact')

useSeoMeta({
  title: contactT('$seo.title'),
  ogTitle: contactT('$seo.title'),
  description: contactT('$seo.desc'),
  ogDescription: contactT('$seo.desc'),
})

const localePath = useLocalePath()
const { getLocationName } = useLocationName()

const fieldErrors = ref<{
  name?: string
  email?: string
  content?: string
  tel?: string
  location?: string
  general?: string
}>({})
const success = ref(false)
const inquiryType = ref('general')
const name = ref('')
const email = ref('')
const content = ref('')
const tel = ref('')
const customLocation = ref('')
const selectedLocation = ref<{lat: number, lng: number, name: string} | undefined>(undefined)
const isSubmitting = ref(false)

function resetForm() {
  fieldErrors.value = {}
  inquiryType.value = 'general'
  name.value = ''
  email.value = ''
  content.value = ''
  tel.value = ''
  customLocation.value = ''
  selectedLocation.value = undefined
}

function validateFormData(): boolean {
  fieldErrors.value = {}

  let isValid = true

  if (!name.value) {
    fieldErrors.value.name = contactT('$form.nameError')
    isValid = false
  } else if (name.value.length < 5) {
    fieldErrors.value.name = contactT('$form.nameMinLengthError')
    isValid = false
  } else if (!/^[a-zA-Z\s'-]+$/.test(name.value)) {
    fieldErrors.value.name = contactT('$form.nameInvalidCharsError')
    isValid = false
  }

  if (!email.value) {
    fieldErrors.value.email = contactT('$form.emailError')
    isValid = false
  } else if (!validateEmail(email.value)) {
    fieldErrors.value.email = contactT('$form.emailNotValid')
    isValid = false
  }

  if (inquiryType.value === 'general') {
    if (!content.value || content.value.length < 100) {
      fieldErrors.value.content = contactT('$form.contentError')
      isValid = false
    }
  }

  if (inquiryType.value === 'partner') {
    if (!tel.value) {
      fieldErrors.value.tel = contactT('$form.telError')
      isValid = false
    } else if (!isValidGermanMobile(tel.value)) {
      fieldErrors.value.tel = contactT('$form.telInvalidFormat')
      isValid = false
    }
    if (!selectedLocation.value) {
      fieldErrors.value.location = contactT('$form.locationError')
      isValid = false
    }
  }

  return isValid
}

function validateEmail(email: string): RegExpMatchArray | null {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-z\-0-9]+\.)+[a-z]{2,}))$/i,
  )
}

function isValidGermanMobile(mobile: string): boolean {
  const digitsOnly = mobile.replace(/\D/g, '')
  const patterns = [
    /^49[157]\d{9}$/,
    /^[157]\d{9}$/,
    /^0[157]\d{9}$/,
  ]
  return patterns.some((p) => p.test(digitsOnly))
}

async function submit() {
  success.value = false
  if (isSubmitting.value) return
  if (!validateFormData()) {
    return
  }

  try {
    isSubmitting.value = true
    if (inquiryType.value === 'general') {
      await $fetch('/api/inquiry', {
        method: 'POST',
        body: {
          name: name.value,
          email: email.value,
          message: content.value
        }
      })
    } else if (inquiryType.value === 'partner') {
      let locationName = selectedLocation.value?.name || ''
      if (!locationName && selectedLocation.value) {
        const fetchedLocationName = await getLocationName(selectedLocation.value.lat, selectedLocation.value.lng)
        locationName = fetchedLocationName || ''
      }
      
      await $fetch('/api/partners/sumit-request', {
        method: 'POST',
        body: {
          name: name.value,
          email: email.value,
          tel: tel.value,
          lon: selectedLocation.value?.lng,
          lat: selectedLocation.value?.lat,
          locationName: locationName
        }
      })
    }

    success.value = true
    resetForm()
  } catch (error) {
    console.error('Submission error:', error)
    fieldErrors.value = { 
      general: contactT('$form.submissionError') || 'An error occurred while submitting your request. Please try again.' 
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="p-5 lg:pt-16">
    <div class="mx-auto grid max-w-6xl gap-8">
      <section class="grid gap-8 md:grid-cols-2 md:gap-16">
        <div class="grid">
          <div class="md:order-last">
            <NuxtImg
              alt="Cubee customer support."
              src="/img/support.jpg"
              class="max-w-64 md:max-w-96"
            />
          </div>

          <div class="space-y-4">
            <h1
              class="text-xl font-semibold md:text-2xl"
              v-text="contactT('$contactSection.title')"
            />
            <p
              class="font-medium leading-relaxed"
              v-text="contactT('$contactSection.paragraph1')"
            />
            <p
              class="font-medium leading-relaxed"
              v-text="contactT('$contactSection.paragraph2')"
            />
          </div>
        </div>

        <div class="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{{ contactT('$getInTouchSection.title') }}</CardTitle>
              <CardDescription>
                {{ contactT('$getInTouchSection.description') }}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-1 gap-4">
                <Select v-model="inquiryType" class="w-full">
                  <SelectTrigger class="w-full">
                    <SelectValue
                      :placeholder="
                        contactT('$getInTouchSection.selectPlaceholder')
                      "
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">
                      {{ contactT('$getInTouchSection.generalInquiry') }}
                    </SelectItem>
                    <SelectItem value="partner">
                      {{ contactT('$getInTouchSection.becomePartner') }}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div class="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:grid-cols-2">
                <div class="space-y-1">
                  <label for="name" class="text-sm">
                    {{ contactT('$getInTouchSection.inputNamePlaceholder') }}
                  </label>

                  <Input
                    id="name"
                    v-model="name"
                    type="text"
                    :placeholder="
                      contactT('$getInTouchSection.inputNamePlaceholder')
                    "
                    :class="{ 'border-red-500': fieldErrors.name }"
                  />
                  <p v-if="fieldErrors.name" class="text-sm text-red-500">
                    {{ fieldErrors.name }}
                  </p>
                </div>

                <div class="space-y-1">
                  <label for="email" class="text-sm">
                    {{ contactT('$getInTouchSection.inputEmailPlaceholder') }}
                  </label>

                  <Input
                    id="email"
                    v-model="email"
                    type="text"
                    :placeholder="
                      contactT('$getInTouchSection.inputEmailPlaceholder')
                    "
                    :class="{ 'border-red-500': fieldErrors.email }"
                  />
                  <p v-if="fieldErrors.email" class="text-sm text-red-500">
                    {{ fieldErrors.email }}
                  </p>
                </div>
              </div>

              <div v-if="inquiryType === 'general'" class="mt-4 md:mt-6">
                <label for="content" class="text-sm">
                  {{ contactT('$getInTouchSection.inputMessagePlaceholder') }}
                </label>

                <Textarea
                  id="content"
                  v-model="content"
                  class="mt-1"
                  type="text"
                  :placeholder="
                    contactT('$getInTouchSection.inputMessagePlaceholder')
                  "
                  :class="{ 'border-red-500': fieldErrors.content }"
                />
                <p v-if="fieldErrors.content" class="text-sm text-red-500 mt-1">
                  {{ fieldErrors.content }}
                </p>
              </div>

              <template v-if="inquiryType === 'partner'">
                <div class="mt-4 grid grid-cols-1 gap-4 md:mt-6">
                  <div class="space-y-1">
                    <label for="tel" class="text-sm">
                      {{ contactT('$getInTouchSection.inputTelPlaceholder') }}
                    </label>

                    <div class="flex items-center gap-2">
                      <h6>+49</h6>
                    <Input
                      id="tel"
                      v-model="tel"
                      type="tel"
                      :placeholder="
                        contactT('$getInTouchSection.inputTelPlaceholder')
                      "
                      :class="{ 'border-red-500': fieldErrors.tel }"
                    />
                    </div>
                    <p v-if="fieldErrors.tel" class="text-sm text-red-500">
                      {{ fieldErrors.tel }}
                    </p>
                  </div>
                </div>

                <div class="mt-4 md:mt-6">
                  <label for="location" class="text-sm">
                    {{ contactT('$getInTouchSection.inputLocationPlaceholder') }}
                  </label>

                  
                  <CustomLocation
                  v-if="!selectedLocation"
                    v-model="selectedLocation"
                    class="mt-1"
                    :class="{ 'border-red-500': fieldErrors.location }"
                  />
                  <h5 v-else class="text-lg">{{ selectedLocation?.name }} <span @click="selectedLocation = undefined" class="text-blue-500 cursor-pointer text-xs underline">want to change?</span></h5>
                  <p v-if="fieldErrors.location" class="text-sm text-red-500 mt-1">
                    {{ fieldErrors.location }}
                  </p>
                </div>
              </template>

              <Button
                class="mt-4 w-full font-semibold"
                variant="primary"
                :disabled="isSubmitting"
                @click="submit"
              >
                <svg
                  v-if="isSubmitting"
                  class="mr-2 h-4 w-4 animate-spin inline-block align-middle"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
                </svg>
                <span class="align-middle">{{ contactT('$getInTouchSection.submitButton') }}</span>
              </Button>

              <p
                v-if="success"
                class="text-positive mt-4 md:mt-6"
                v-text="contactT('$getInTouchSection.successMessage')"
              ></p>
            </CardContent>
          </Card>
        </div>
      </section>

      <hr />

      <section class="max-w-4xl">
        <h2
          class="font-semibold md:text-lg"
          v-text="contactT('$FAQSection.title')"
        />

        <Accordion class="mt-4 md:mt-6 md:text-lg" type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger class="text-left font-semibold">{{
              contactT('$FAQSection.faq1.question')
            }}</AccordionTrigger>
            <AccordionContent>
              <p
                class="text-base font-medium !leading-relaxed md:text-lg"
                v-text="contactT('$FAQSection.faq1.answer')"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger class="text-left font-semibold">{{
              contactT('$FAQSection.faq2.question')
            }}</AccordionTrigger>
            <AccordionContent>
              <p
                class="text-base font-medium !leading-relaxed md:text-lg"
                v-text="contactT('$FAQSection.faq2.answer')"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger class="text-left font-semibold">{{
              contactT('$FAQSection.faq3.question')
            }}</AccordionTrigger>
            <AccordionContent>
              <p
                class="text-base font-medium !leading-relaxed md:text-lg"
                v-text="contactT('$FAQSection.faq3.answer')"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger class="text-left font-semibold">{{
              contactT('$FAQSection.faq4.question')
            }}</AccordionTrigger>
            <AccordionContent>
              <p
                class="text-base font-medium !leading-relaxed md:text-lg"
                v-text="contactT('$FAQSection.faq4.answer')"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger class="text-left font-semibold">{{
              contactT('$FAQSection.faq5.question')
            }}</AccordionTrigger>
            <AccordionContent>
              <p
                class="text-base font-medium !leading-relaxed md:text-lg"
                v-text="contactT('$FAQSection.faq5.answer')"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-6">
            <AccordionTrigger class="text-left font-semibold">{{
              contactT('$FAQSection.faq6.question')
            }}</AccordionTrigger>
            <AccordionContent>
              <p
                class="text-base font-medium !leading-relaxed md:text-lg"
                v-text="contactT('$FAQSection.faq6.answer')"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-7">
            <AccordionTrigger class="text-left font-semibold">{{
              contactT('$FAQSection.faq7.question')
            }}</AccordionTrigger>
            <AccordionContent>
              <p
                class="text-base font-medium !leading-relaxed md:text-lg"
                v-text="contactT('$FAQSection.faq7.answer')"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-8">
            <AccordionTrigger class="text-left font-semibold">{{
              contactT('$FAQSection.faq8.question')
            }}</AccordionTrigger>
            <AccordionContent>
              <p
                class="text-base font-medium !leading-relaxed md:text-lg"
                v-text="contactT('$FAQSection.faq8.answer')"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-9">
            <AccordionTrigger class="text-left font-semibold">{{
              contactT('$FAQSection.faq9.question')
            }}</AccordionTrigger>
            <AccordionContent>
              <p
                class="text-base font-medium !leading-relaxed md:text-lg"
                v-text="contactT('$FAQSection.faq9.answer')"
              />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-10">
            <AccordionTrigger class="text-left font-semibold">{{
              contactT('$FAQSection.faq10.question')
            }}</AccordionTrigger>
            <AccordionContent class="text-base md:text-lg">
              <NuxtLink class="link" :to="localePath({ name: 'finder' })">{{
                contactT('$FAQSection.faq10.answer.1')
              }}</NuxtLink>
              {{ contactT('$FAQSection.faq10.answer.2') }}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <p class="mt-4 text-sm font-medium md:mt-6 md:text-base">
          {{ contactT('$FAQSection.additionalInfo.1') }}
          <NuxtLink class="link" :to="localePath({ name: 'contact' })">{{
            contactT('$FAQSection.additionalInfo.2')
          }}</NuxtLink>
          {{ contactT('$FAQSection.additionalInfo.3') }}
        </p>
      </section>
    </div>
  </div>
</template>
