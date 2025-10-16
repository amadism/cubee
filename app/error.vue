<script setup lang="ts">
import type { NuxtError } from '#app'

const { error } = defineProps({ error: Object as () => NuxtError })

const { t } = useMessages('global')

const localePath = useLocalePath()
</script>

<template>
  <NuxtLayout name="default">
    <div
      class="bg-gradient-to-b from-amber-200 to-white p-4 pb-32 pt-20 md:pb-48 lg:pb-96"
    >
      <div class="mx-auto flex max-w-6xl flex-col items-center gap-4">
        <h2 class="text-4xl">{{ error?.statusCode }}</h2>
        <p class="text-3xl font-semibold">
          {{ error?.statusMessage ?? error?.message }}
        </p>

        <NuxtLink class="mt-4 inline-flex" :to="localePath('/')">
          <Button variant="primary">
            {{ t('home') }}
          </Button>
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>
