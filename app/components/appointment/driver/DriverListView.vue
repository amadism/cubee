<script setup lang="ts">
import type { UserLocation } from '../location-selection'
import { faArrowLeft } from '@fortawesome/pro-solid-svg-icons'
import DriverView from '~/components/appointment/driver/Driver.vue'

const { userLocation } = defineProps<{
  userLocation: UserLocation
}>()

const emit = defineEmits<{ back: []; select: [Driver] }>()

const { t } = useMessages('appointment')

const nearbyDrivers = useNearbyDrivers(() => userLocation)
</script>

<template>
  <div class="space-y-4 md:space-y-8 md:pt-10">
    <div class="grid gap-4 md:grid-cols-3 md:gap-8 lg:gap-12">
      <div class="flex justify-center md:justify-start">
        <NuxtPicture
          alt="Driver Hero Image"
          src="/img/introduction.png"
          class="max-h-40 w-full md:max-h-none"
          :img-attrs="{
            class: 'w-full h-full object-contain object-center',
          }"
        />
      </div>

      <div class="space-y-4 md:col-span-2 md:max-w-lg md:pt-8">
        <h2 class="text-center text-lg font-bold md:text-left md:text-2xl">
          {{ t('$drivers.title') }}
        </h2>

        <p
          class="text-balance text-center font-medium !leading-relaxed md:text-left md:text-lg"
        >
          {{ t('$drivers.desc') }}
        </p>

        <div class="flex justify-center md:justify-start">
          <Button
            size="sm"
            variant="outline"
            class="gap-1.5"
            @click="emit('back')"
          >
            <Icon :icon="faArrowLeft" />
            {{ t('$drivers.back') }}
          </Button>
        </div>
      </div>
    </div>

    <Alert v-if="!nearbyDrivers.length" class="font-medium">
      {{ t('$drivers.not-found') }}
    </Alert>

    <template v-else>
      <hr />

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <DriverView
          v-for="(driver, idx) in nearbyDrivers"
          :key="driver.location.id"
          class="h-full"
          :driver="driver.location"
          :user-location="userLocation"
          :highlight="idx === 0"
        />
      </div>

      <hr />

      <AppointmentMap
        mode="driver"
        :locations="nearbyDrivers.map(({ location }) => location)"
      />
    </template>
  </div>
</template>
