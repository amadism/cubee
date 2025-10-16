<script setup lang="ts">
import { faHandPointRight } from '@fortawesome/pro-solid-svg-icons'

const { t } = useMessages('home')
const localePath = useLocalePath()
</script>

<template>
  <section class="grid items-center md:grid-cols-2 md:gap-8">
    <div class="opacity-75 md:order-last md:opacity-100">
      <NuxtImg alt="Cubee car appraisal." src="/img/appraisal.jpg" />
    </div>

    <div class="relative z-10 -mt-24 space-y-4 md:mt-0 md:space-y-6">
      <h2
        class="text-2xl font-semibold !leading-snug lg:text-3xl"
        v-text="t('$process.title')"
      />
      <p class="font-medium leading-relaxed" v-text="t('$process.paragraph')" />

      <NuxtLink
        class="inline-block"
        :to="`${localePath({ name: 'about' })}#process`"
      >
        <Button variant="outline" class="gap-2" size="lg">
          <Icon :icon="faHandPointRight" />
          {{ t('$process.cta') }}
        </Button>
      </NuxtLink>
    </div>
  </section>
</template>
