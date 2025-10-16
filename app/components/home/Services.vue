<script setup lang="ts">
import { faHandPointRight } from '@fortawesome/pro-solid-svg-icons'

const { t } = useMessages('home')
const localePath = useLocalePath()
</script>

<template>
  <section class="space-y-2 md:space-y-4 md:p-8">
    <h2 class="font-semibold" v-text="t('$services.title')" />

    <p
      class="text-sm font-medium md:text-base"
      v-text="t('$services.subtitle')"
    />

    <div
      class="-mx-5 grid divide-y border-y lg:-mx-8 lg:grid-cols-3 lg:divide-x lg:divide-y-0 xl:-mx-16 2xl:-mx-24"
    >
      <div class="space-y-2 p-5 hover:bg-gray-50 md:space-y-4 md:p-8">
        <h3 class="flex items-center gap-2 text-lg font-semibold">
          <BrandLogoBee class="size-8" />
          <span class="translate-y-0.5" v-text="t('$services.$damage.title')" />
        </h3>

        <p
          class="text-sm font-medium !leading-relaxed md:text-base"
          v-text="t('$services.$damage.description')"
        />
      </div>

      <div class="space-y-2 p-5 hover:bg-gray-50 md:space-y-4 md:p-8">
        <h3 class="flex items-center gap-2 text-lg font-semibold">
          <BrandLogoBee class="size-8" />
          <span class="translate-y-0.5" v-text="t('$services.$value.title')" />
        </h3>

        <p
          class="text-sm font-medium !leading-relaxed md:text-base"
          v-text="t('$services.$value.description')"
        />
      </div>

      <div class="space-y-2 p-5 hover:bg-gray-50 md:space-y-4 md:p-8">
        <h3 class="flex items-center gap-2 text-lg font-semibold">
          <BrandLogoBee class="size-8" />
          <span
            class="translate-y-0.5"
            v-text="t('$services.$oldtimer.title')"
          />
        </h3>

        <p
          class="text-sm font-medium !leading-relaxed md:text-base"
          v-text="t('$services.$oldtimer.description')"
        />
      </div>
    </div>

    <div class="flex justify-end">
      <NuxtLink
        :to="localePath({ name: 'contact' })"
        class="inline-block w-full md:w-auto"
      >
        <Button class="w-full gap-2 font-semibold" variant="outline">
          <Icon :icon="faHandPointRight" />
          <span v-text="t('$services.getInTouch')" />
        </Button>
      </NuxtLink>
    </div>
  </section>
</template>
