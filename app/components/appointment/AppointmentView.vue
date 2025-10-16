<script setup lang="ts">
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import {
  faEnvelope,
  faGlobe,
  faMapPin,
  faPhone,
  faRoute,
} from '@fortawesome/pro-solid-svg-icons'
import {
  MapboxMap,
  MapboxMarker,
  // @ts-expect-error missing types
} from '@studiometa/vue-mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const { mode, title, cityName, calendarUrl, address, location } = defineProps<{
  mode: 'station' | 'driver'
  title: string
  cityName: string
  calendarUrl?: string
  address?: string
  location?: { lat: number; lng: number }
}>()

const { t: schedulerT } = useMessages('scheduler')
const { t: globalT } = useMessages('global')

const section2Items = useI18nArray<{
  title: string
  content: string
}>('scheduler', '$section2.items')

const section3Items = useI18nArray<{
  title: string
  content: string
}>('scheduler', '$section3.items', {
  transform: (item) => {
    item.content = item.content.replaceAll('{cityName}', cityName || '')
    return item
  },
})

const section4Items = useI18nArray<{
  title: string
  content: string
}>('scheduler', '$section4.items', {
  transform: (item) => {
    item.content = item.content.replaceAll('{cityName}', cityName || '')
    return item
  },
})

const faqItems = useI18nArray<{
  question: string
  answer: string
}>('scheduler', '$faq.items', {
  transform: (item) => {
    item.answer = item.answer.replaceAll('{cityName}', cityName || '')
    return item
  },
})

const mapCenter = computed(() => {
  if (location) {
    return [location.lng, location.lat]
  }

  return [10.4515, 51.1657] // Germany
})

const navigateUrl = computed(() =>
  location
    ? `https://www.google.com/maps/dir/?api=1&destination=${location?.lat},${location?.lng}`
    : null,
)
</script>

<template>
  <div class="p-5 text-gray-900">
    <div class="mx-auto max-w-6xl">
      <h1 class="mb-6 text-2xl font-semibold md:text-3xl" v-text="title" />

      <section v-if="calendarUrl" class="rounded border border-gray-200">
        <iframe class="h-[75vh] w-full md:h-[850px]" :src="calendarUrl" />
      </section>

      <main class="prose mt-16 max-w-none divide-y font-medium">
        <section class="max-w-4xl">
          <h2
            v-text="
              schedulerT('$section1.title', {
                cityName,
              })
            "
          />
          <p
            v-text="
              schedulerT('$section1.description', {
                cityName,
              })
            "
          />

          <h3
            v-text="
              schedulerT('$section2.title', {
                cityName,
              })
            "
          />

          <ul class="font-medium">
            <li v-for="(item, idx) of section2Items" :key="idx">
              <span
                class="font-semibold text-gray-950"
                v-text="`${item.title}:`"
              />
              <span class="ml-1.5" v-text="item.content" />
            </li>
          </ul>
        </section>

        <section class="mt-16 items-center gap-12 md:grid md:grid-cols-5">
          <div class="md:col-span-3">
            <h2
              class="text-xl font-semibold"
              v-text="
                schedulerT('$section3.title', {
                  cityName,
                })
              "
            />

            <ul class="list-disc">
              <li v-for="item of section3Items" :key="item.title">
                <span
                  class="font-semibold text-gray-950"
                  v-html="`${item.title}:`"
                />
                <span class="ml-1.5" v-text="item.content" />
              </li>
            </ul>
          </div>

          <NuxtImg
            class="hidden md:col-span-2 md:block"
            src="/img/cartalk.jpg"
          />
        </section>

        <section class="mt-16 max-w-4xl">
          <h2
            v-text="
              schedulerT('$section4.title', {
                cityName,
              })
            "
          />

          <ul>
            <li v-for="(item, idx) of section4Items" :key="idx">
              <span
                class="font-semibold text-gray-950"
                v-text="`${item.title}:`"
              />
              <span class="ml-1.5" v-text="item.content" />
            </li>
          </ul>

          <div class="not-prose mt-16 max-w-xl space-y-3">
            <HomeCallToAction />
          </div>
        </section>
      </main>

      <hr class="my-12" />

      <section class="max-w-4xl">
        <h2
          class="text-2xl font-semibold"
          v-html="
            schedulerT('$faq.title', {
              cityName,
            })
          "
        />

        <Accordion class="mt-4 md:text-lg" type="single" collapsible>
          <AccordionItem
            v-for="(item, index) of faqItems"
            :key="index"
            :value="index.toString()"
          >
            <AccordionTrigger class="text-left font-semibold">
              {{ item.question }}
            </AccordionTrigger>
            <AccordionContent>
              <p
                class="text-base font-medium !leading-relaxed md:text-lg"
                v-text="item.answer"
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section class="mt-16 max-w-4xl">
        <div class="prose">
          <h2
            v-html="
              schedulerT('$section5.title', {
                cityName,
              })
            "
          />
        </div>

        <ul class="-mx-4 mt-4 grid gap-px bg-gray-200 sm:grid-cols-2">
          <li>
            <NuxtLink
              class="flex items-center gap-4 bg-white p-4 duration-100 hover:bg-gray-50"
              to="tel:+498002823333"
            >
              <Icon class="text-primary-500 text-2xl" :icon="faPhone" />
              <div class="flex flex-col">
                <h3
                  class="text-primary-500 text-sm font-semibold leading-snug"
                  v-text="globalT('$contact.phone')"
                />
                <span class="text-lg font-semibold leading-snug">
                  +49 (0)800 2823333
                </span>
              </div>
            </NuxtLink>
          </li>

          <li>
            <NuxtLink
              to="https://wa.me/4969348753210"
              class="flex items-center gap-4 bg-white p-4 duration-100 hover:bg-gray-50"
            >
              <Icon class="text-2xl text-green-600" :icon="faWhatsapp" />
              <div class="flex flex-col">
                <h3 class="text-sm font-semibold leading-snug text-green-600">
                  WhatsApp
                </h3>
                <span class="text-lg font-semibold leading-snug">
                  +49 (0)69 – 348753210
                </span>
              </div>
            </NuxtLink>
          </li>

          <li>
            <NuxtLink
              class="flex items-center gap-4 bg-white p-4 duration-100 hover:bg-gray-50"
              to="mailto:info@cubee.expert"
            >
              <Icon class="text-2xl text-gray-500" :icon="faEnvelope" />
              <div class="flex flex-col">
                <h3
                  class="text-sm font-semibold leading-snug text-gray-500"
                  v-text="globalT('$contact.email')"
                />
                <span class="text-lg font-semibold leading-snug">
                  info@cubee.expert
                </span>
              </div>
            </NuxtLink>
          </li>

          <li>
            <NuxtLink
              class="flex items-center gap-4 bg-white p-4 duration-100 hover:bg-gray-50"
              to="https://www.cubee.expert"
            >
              <Icon class="text-2xl text-gray-500" :icon="faGlobe" />
              <div class="flex flex-col">
                <h3
                  class="text-sm font-semibold leading-snug text-gray-500"
                  v-text="globalT('$contact.web')"
                />
                <span class="text-lg font-semibold leading-snug">
                  www.cubee.expert
                </span>
              </div>
            </NuxtLink>
          </li>
        </ul>

        <MapboxMap
          v-if="location"
          class="mt-4 h-96 w-full overflow-hidden rounded-lg md:h-[400px]"
          access-token="pk.eyJ1IjoibW9kZXJuaWNlIiwiYSI6ImNseDF3ZmdsdjBkd3cycXM5NXZlYTBxd2IifQ.4TdDROuEq-7vnDBBqjO8cw"
          map-style="mapbox://styles/modernice/clx1x53gt01qf01qr83qgauzj"
          :center="mapCenter"
          :zoom="10"
        >
          <MapboxMarker :lng-lat="[location.lng, location.lat]" color="#FEC700">
            <img
              v-if="mode === 'station'"
              src="/station.png"
              style="height: 40px; width: 40px"
            />
            <img
              v-else-if="mode === 'driver'"
              src="/car.png"
              style="height: 40px; width: 40px"
            />
          </MapboxMarker>
        </MapboxMap>

        <div
          v-if="address && navigateUrl"
          class="mt-4 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between"
        >
          <p class="text-sm text-gray-600">
            <Icon class="mr-2" :icon="faMapPin" />
            <span class="font-semibold" v-text="address" />
          </p>

          <NuxtLink
            :to="navigateUrl"
            target="_blank"
            external
            class="block w-full sm:w-auto"
          >
            <Button class="w-full gap-2" variant="primary" size="lg">
              <Icon :icon="faRoute" />
              {{ schedulerT('$contact.navigate') }}
            </Button>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>
