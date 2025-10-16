<script setup lang="ts">
const { t } = useMessages('home')
const localePath = useLocalePath()
</script>

<template>
  <section>
    <div class="grid items-center md:grid-cols-2 md:gap-8">
      <div class="md:order-last">
        <NuxtImg
          alt="Cubee customer support."
          src="/img/support.jpg"
          class="mx-auto w-64 md:w-auto"
        />
      </div>

      <div class="space-y-4">
        <h2
          class="text-xl font-semibold md:text-3xl"
          v-text="t('$contact.title')"
        />

        <p
          class="font-medium !leading-relaxed md:text-balance md:text-lg"
          v-text="t('$contact.subtitle')"
        />

        <NuxtLink :to="localePath({ name: 'contact' })" class="inline-block">
          <Button variant="primary" size="lg">
            <span v-text="t('$contact.button')" />
          </Button>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
