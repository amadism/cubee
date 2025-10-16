<script lang="ts" setup>
import {
  faEnvelope,
  faHandshakeAlt,
  faMagnifyingGlass,
} from '@fortawesome/pro-regular-svg-icons'
import { faHandPointRight } from '@fortawesome/pro-solid-svg-icons'

definePageMeta({
  middleware: ['i18n:messages'],
  messages: ['about'],
})
const { t: aboutT } = useMessages('about')

defineI18nRoute({
  paths: {
    de: '/ueber-uns',
  },
})

useSeoMeta({
  title: aboutT('$seo.title'),
  ogTitle: aboutT('$seo.title'),
  description: aboutT('$seo.desc'),
  ogDescription: aboutT('$seo.desc'),
})

const localePath = useLocalePath()
</script>

<template>
  <div>
    <div class="relative">
      <div class="absolute inset-0">
        <NuxtImg
          :alt="aboutT('$welcome.imageAlt')"
          src="/img/headquarter.jpg"
          class="h-full w-full object-cover object-center"
        />
      </div>

      <div class="relative z-10 bg-black/75 p-6 text-white md:py-16">
        <div class="mx-auto max-w-6xl">
          <div class="section">
            <div class="max-w-xl space-y-4">
              <h1
                class="text-xl font-semibold md:text-2xl"
                v-text="aboutT('$welcome.title')"
              />
              <p
                class="font-medium !leading-relaxed md:text-lg"
                v-text="aboutT('$welcome.paragraph')"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-6xl">
      <div class="relative">
        <div class="bg-fullw bg-lightblue-100" />

        <div class="section px-5 py-8 md:py-16">
          <div class="grid gap-8 md:grid-cols-2 md:gap-16">
            <div>
              <figure>
                <NuxtImg
                  :alt="aboutT('$concept.imageAlt')"
                  src="/img/beehive.png"
                />
                <figcaption
                  class="mt-1 text-center text-xs font-medium"
                  v-text="aboutT('$concept.imageCaption')"
                />
              </figure>
            </div>

            <div>
              <h2
                class="text-xl font-semibold md:text-2xl"
                v-text="aboutT('$concept.title')"
              />
              <p
                class="mt-4 font-medium leading-relaxed md:mt-6"
                v-text="aboutT('$concept.paragraph')"
              />
            </div>
          </div>
        </div>
      </div>

      <section id="process" class="space-y-8 px-5 py-8 md:space-y-16 md:py-16">
        <h2
          class="text-xl font-semibold md:text-2xl"
          v-text="aboutT('$process.title')"
        />

        <div class="space-y-8 md:px-16">
          <div class="grid grid-cols-3 items-center gap-2 md:gap-16">
            <div class="col-span-2 space-y-2 md:space-y-4">
              <h3
                class="font-semibold sm:text-lg md:text-xl"
                v-text="aboutT('$process.$step-1.title')"
              />

              <p
                class="text-sm font-medium !leading-relaxed sm:text-base md:text-balance md:text-lg"
                v-text="aboutT('$process.$step-1.content')"
              />

              <NuxtLink
                :to="localePath({ name: 'finder' })"
                class="inline-block"
              >
                <Button variant="primary">
                  <Icon :icon="faMagnifyingGlass" class="text-gray-950" />
                  <span
                    class="ml-2"
                    v-text="aboutT('$process.$step-1.findLocationButton')"
                  />
                </Button>
              </NuxtLink>
            </div>

            <NuxtImg
              :alt="aboutT('$imageAlts.computer')"
              src="/img/pc.jpg"
              class="md:max-h-72"
            />
          </div>

          <hr />

          <div class="grid grid-cols-5 items-center gap-4 md:gap-16">
            <div class="col-span-full flex justify-center md:col-span-2">
              <NuxtImg
                :alt="aboutT('$imageAlts.carTalk')"
                src="/img/cartalk.jpg"
                class="max-h-48 md:max-h-full"
              />
            </div>

            <div class="col-span-full space-y-2 md:col-span-3 md:space-y-4">
              <h3
                class="text-center font-semibold sm:text-lg md:text-left md:text-xl"
                v-text="aboutT('$process.$step-2.title')"
              />

              <p
                class="text-balance text-center font-medium !leading-relaxed md:text-left md:text-lg"
                v-text="aboutT('$process.$step-2.content')"
              />
            </div>
          </div>

          <hr />

          <div class="grid grid-cols-5 items-center gap-8 md:gap-16">
            <div class="col-span-full space-y-2 md:col-span-3 md:space-y-4">
              <h3
                class="text-center font-semibold sm:text-lg md:text-left md:text-xl"
                v-text="aboutT('$process.$step-3.title')"
              />

              <p
                class="text-balance text-center font-medium !leading-relaxed md:text-left md:text-lg"
                v-text="aboutT('$process.$step-3.content')"
              />
            </div>

            <div class="col-span-full flex justify-center md:col-span-2">
              <NuxtImg
                :alt="aboutT('$imageAlts.mail')"
                src="/img/mail.jpg"
                class="max-h-48 md:max-h-full"
              />
            </div>
          </div>
        </div>
      </section>

      <hr />

      <section class="p-5 sm:py-10 md:py-16">
        <div class="mx-auto max-w-6xl">
          <div
            class="md:grid md:grid-cols-5 md:items-center md:overflow-hidden md:rounded-xl md:border"
          >
            <div class="md:col-span-3 md:p-12">
              <h2
                class="text-center text-xl font-semibold md:text-left md:text-2xl"
              >
                <Icon :icon="faHandshakeAlt" />
                {{ aboutT('$join-us.title') }}
              </h2>

              <p
                class="mx-auto mt-4 max-w-4xl text-balance text-center font-medium !leading-relaxed md:text-left md:text-lg"
                v-text="aboutT('$join-us.content')"
              />
            </div>

            <div class="relative -mx-5 -mt-20 md:col-span-2 md:mx-0 md:mt-0">
              <NuxtImg
                :alt="aboutT('$imageAlts.handshake')"
                src="/img/handshake.png"
                class="relative -z-10 mx-auto opacity-25 md:scale-125"
              />

              <div class="absolute inset-0 flex items-center justify-center">
                <NuxtLink :to="localePath({ name: 'contact' })">
                  <Button variant="primary" size="lg" class="gap-2">
                    <Icon :icon="faHandPointRight" />
                    {{ aboutT('$join-us.becomeFranchiseeButton') }}
                  </Button>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
/* .bg-fullw {
  position: absolute;
  z-index: -1;
  width: 200vw;
  height: 100%;
  left: -50vw;
} */
</style>
