<script setup lang="ts">
import type { UserLocation } from '../location-selection'
import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons'
import Container from '~/components/appointment/container/Container.vue'
import type { Station } from '~/composables/useStations'

const { userLocation } = defineProps<{
  userLocation: UserLocation
}>()

const emit = defineEmits<{ back: []; select: [Station] }>()

const { t } = useMessages('appointment')

type PartnerPublic = { id: string | number; location: { lat: number; lng: number } }

const partners = ref<PartnerPublic[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const data = await $fetch<any[]>('/api/partners/public')
    partners.value = (data || []).map((p) => ({
      id: p.id,
      location: { lat: p.lat ?? p.latitude, lng: p.lon ?? p.lng },
    }))
  } catch (e) {
    partners.value = []
  } finally {
    loading.value = false
  }
})

const nearbyPartners = useNearby(() => partners.value, () => userLocation)
const showAll = ref(false)
const visiblePartners = computed(() => {
  return showAll.value ? nearbyPartners.value : nearbyPartners.value.slice(0, 3)
})
</script>

<template>
  <div class="space-y-4 md:space-y-8 md:pt-10">
    <div class="grid gap-4 md:grid-cols-3 md:gap-8 lg:gap-12">
      <div class="flex justify-center md:justify-start">
        <NuxtPicture
          alt="CUBEE Hero Image"
          src="/img/introduction.png"
          class="max-h-40 w-full md:max-h-none"
          :img-attrs="{
            class: 'w-full h-full object-contain object-center',
          }"
        />
      </div>

      <div class="space-y-4 md:col-span-2 md:max-w-lg md:pt-8">
        <h2 class="text-center text-lg font-bold md:text-left md:text-2xl">
          {{ t('$stations.title') }}
        </h2>

        <p
          class="text-balance text-center font-medium !leading-relaxed md:text-left md:text-lg"
        >
          {{ t('$stations.desc') }}
        </p>

        <div class="flex justify-center md:justify-start">
          <Button
            size="sm"
            variant="outline"
            class="gap-1.5"
            @click="emit('back')"
          >
            <Icon :icon="faArrowLeft" />
            {{ t('$stations.back') }}
          </Button>
        </div>
      </div>
    </div>

    <hr />

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <template v-if="loading">
        <div
          v-for="i in 3"
          :key="`skeleton-${i}`"
          class="bg-gradient-to-br from-white to-yellow-50 rounded-lg border border-gray-200 p-4 space-y-4 h-full"
        >
          <div class="space-y-2">
            <div class="h-6 w-3/4 bg-gray-200 rounded animate-pulse" />
            <div class="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
          </div>
          <div class="space-y-2">
            <div class="h-12 w-full bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </template>
      <TransitionGroup v-else name="station-list">
        <Container
          v-for="(p, idx) in visiblePartners"
          :key="p.location.id ?? p.id"
          class="station-item h-full"
          :partner="p"
          :user-location="userLocation"
          :highlight="idx === 0"
        />
      </TransitionGroup>
    </div>

    <div v-if="nearbyPartners.length > 3 && !showAll" class="flex justify-center">
      <Button size="sm" @click="showAll = true">
        {{ t('$stations.viewMore') }}
      </Button>
    </div>

    <hr />

    <AppointmentMap :locations="nearbyPartners.map((x) => ({ id: x.id, location: x.location }))" />
  </div>
</template>

<style scoped>
.station-list-enter-active,
.station-list-leave-active {
  transition: all 0.5s ease;
}
.station-list-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.station-list-leave-to {
  opacity: 0;
}
.station-item {
  transition: all 0.3s ease;
}
</style>
