<script lang="js" setup>
import PartnersMap from '@/components/partners-map/PartnersMap.vue'

definePageMeta({
  middleware: ['i18n:messages'],
  messages: ['finder'],
})

const { t: finderT } = useMessages('finder')
const { t: globalT } = useMessages('global')
const localePath = useLocalePath()
useSeoMeta({
  title: finderT('$seo.title'),
  ogTitle: finderT('$seo.title'),
  description: finderT('$seo.desc'),
  ogDescription: finderT('$seo.desc'),
})

const partners = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await $fetch('/api/partners/public')
    partners.value = (Array.isArray(data) ? data : []).map((p) => ({
      id: p.id,
      name: p.name,
      location_name: p.location_name,
      location: { lat: p.lat ?? p.latitude, lng: p.lon ?? p.lng },
    }))
  } catch (e) {
    partners.value = []
  } finally {
    loading.value = false
  }
})

</script>

<template>
  <div class="p-5">
    <div class="mx-auto max-w-6xl space-y-4">
      <section class="flex items-center justify-between w-full flex-wrap gap-4">
        <h1
          class="text-xl font-semibold md:text-2xl"
          v-text="finderT('$hero.title')"
        />

        <Button :to="localePath({ name: 'contact', query: { type: 'partner_request' } })" variant="primary">
          <span v-text="globalT('becomePartner')" />
        </Button>
      </section>

      <section>
        <div class="grid gap-y-4 md:grid-cols-5 md:gap-4">
          <div
            class="locations-holder relative space-y-4 overflow-hidden rounded-lg md:order-last md:col-span-2 md:max-h-[40rem] md:overflow-y-auto md:overscroll-contain"
          >
            

            <div class="relative space-y-2">
              <template v-if="loading">
                <div
                  v-for="i in 3"
                  :key="`skeleton-${i}`"
                  class="bg-gradient-to-br from-white to-yellow-50 rounded-lg border border-gray-200 px-4 py-6 space-y-4"
                >
                  <div class="space-y-2">
                    <div class="h-8 w-3/4 bg-gray-200 rounded animate-pulse" />
                    <div class="h-6 w-1/2 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div class="space-y-2">
                    <div class="h-8 w-full bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </template>
              <template v-else>
                <AppointmentContainer
                  v-for="p in partners"
                  :key="p.id"
                  :partner="p"
                />
                <p v-if="!partners.length" class="text-center text-gray-400">
                  {{ finderT('notFound') }}
                </p>
              </template>
            </div>
          </div>

          <div class="md:col-span-3">
            <PartnersMap :partners="partners" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.location-box {
  @apply relative inline-flex w-full rounded-lg bg-gray-200 p-4;
}

/* .locations-holder::after {
  position: absolute;
  content: '';
  height: 100%;
  width: 100%;
  bottom: 0;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    rgba(7, 13, 21, 0) 0%,
    rgba(7, 13, 21, 0) 95%,
    rgba(7, 13, 21, 0.2) 100%
  );
  mix-blend-mode: darken;
} */
</style>
