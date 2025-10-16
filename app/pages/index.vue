<script lang="ts" setup>
import HomeCallToAction from '~/components/home/CallToAction.vue'

definePageMeta({
  middleware: ['i18n:messages'],
  messages: ['home'],
})

const localePath = useLocalePath()

const { t: homeT } = useMessages('home')

useSeoMeta({
  title: homeT('$seo.title'),
  ogTitle: homeT('$seo.title'),
  description: homeT('$seo.desc'),
  ogDescription: homeT('$seo.desc'),
})
</script>

<template>
  <div class="p-5">
    <div class="mx-auto max-w-6xl">
      <div class="bg-introduction" />

      <section class="grid items-center gap-16 md:grid-cols-2 lg:gap-24">
        <div class="space-y-4 lg:pt-16">
          <NuxtPicture
            alt="CUBEE Hero Image"
            src="/img/introduction.png"
            class="w-full md:hidden"
            :img-attrs="{ class: 'w-full object-contain object-center' }"
          />

          <div class="space-y-4">
            <h1
              class="hyphens-auto text-balance text-2xl font-semibold !leading-snug lg:text-4xl"
              v-text="homeT('$hero.title')"
            />

            <p
              class="text-xl font-medium leading-snug text-gray-600"
              v-text="homeT('$hero.subtitle')"
            />
          </div>

          <HomeCallToAction />
        </div>

        <NuxtPicture
          alt="CUBEE Hero Image"
          src="/img/introduction.png"
          class="hidden md:block"
          :img-attrs="{ class: 'w-full object-contain object-center' }"
        />
      </section>

      <hr class="my-8 md:my-16" />

      <section class="relative">
        <div class="bg-blurred" />

        <div class="grid items-center md:grid-cols-3 md:gap-16">
          <div class="md:order-last">
            <div class="relative -translate-x-24 md:translate-x-0">
              <NuxtPicture
                alt="CUBEE country map"
                src="/img/germany.png"
                :img-attrs="{ class: 'w-full object-contain object-center' }"
                class="block w-64 opacity-25 md:w-full md:opacity-100"
              />
              <div
                class="absolute inset-0 bg-gradient-to-b from-transparent to-[#f8fafe] md:hidden"
              />
            </div>
          </div>

          <div class="relative z-10 -mt-72 space-y-4 md:col-span-2 md:mt-0">
            <h2
              class="text-2xl font-semibold !leading-snug md:text-3xl"
              v-text="homeT('$introduction.title')"
            />

            <p
              class="font-medium !leading-relaxed md:text-lg"
              v-text="homeT('$introduction.paragraph')"
            />

            <NuxtLink :to="localePath({ name: 'about' })" class="inline-flex">
              <Button variant="outline" size="lg">
                <span v-text="homeT('$introduction.more')" />
              </Button>
            </NuxtLink>
          </div>
        </div>
      </section>

      <HomeServices class="mt-16" />
      <HomeProcess />
      <hr class="my-8" />
      <HomeReviews />
      <HomeContact />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.bg-introduction {
  position: absolute;
  z-index: -1;
  width: 100vw;
  height: 100%;
  top: 0;
  left: 0;
  right: 0;
  background-image: url('/img/beehive_seamless.svg');
  background-repeat: repeat;
  background-position: center;
  background-size: 150px;
  opacity: 0.5;
}

.bg-blurred {
  position: absolute;
  z-index: -1;
  width: 100vw;
  height: 100%;
  top: 0;
  left: calc(-50vw + 50%);
  right: 0;
  background: linear-gradient(
    to bottom,
    rgba(247, 250, 254, 0) 0%,
    rgba(247, 250, 254, 1) 15%,
    rgba(247, 250, 254, 1) 85%,
    rgba(247, 250, 254, 0) 100%
  );
}
</style>
