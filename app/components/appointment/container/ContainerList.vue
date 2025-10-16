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

const nearbyStations = useNearbyStations(() => userLocation)
const showAllStations = ref(false)
const visibleStations = computed(() => {
  return showAllStations.value
    ? nearbyStations.value
    : nearbyStations.value.slice(0, 3)
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
      <TransitionGroup name="station-list">
        <Container
          v-for="(station, idx) in visibleStations"
          :key="station.location.id"
          class="station-item h-full"
          :station="station.location"
          :user-location="userLocation"
          :highlight="idx === 0"
        />
      </TransitionGroup>
    </div>

    <div
      v-if="nearbyStations.length > 3 && !showAllStations"
      class="flex justify-center"
    >
      <Button size="sm" @click="showAllStations = true">
        {{ t('$stations.viewMore') }}
      </Button>
    </div>

    <hr />

    <AppointmentMap
      mode="station"
      :locations="nearbyStations.map(({ location }) => location)"
    />
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
