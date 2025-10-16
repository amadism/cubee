<script setup lang="ts">
import type { UserLocation } from '.'
import { faLocationDot } from '@fortawesome/pro-light-svg-icons'
import ReturnButton from '~/components/appointment/global/ReturnButton.vue'
import CurrentLocation from '~/components/appointment/location-selection/CurrentLocation.vue'
import CustomLocation from '~/components/appointment/location-selection/CustomLocation.vue'

const location = defineModel<UserLocation>()

const { t: appointmentT } = useMessages('appointment')

const { activeStations } = useStations()
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
          {{ appointmentT('$vehicle-location.title') }}
        </h2>

        <p
          class="text-balance text-center font-medium !leading-relaxed md:text-left md:text-lg"
        >
          {{ appointmentT(`$vehicle-location.desc:${mode}`) }}
        </p>

        <div class="space-y-2">
          <CurrentLocation
            class="w-full"
            @select="(coords) => (location = { ...coords, name: '<current>' })"
          />

          <CustomLocation v-model="location" />
        </div>
      </div>
    </div>

    <hr />

    <AppointmentMap mode="partners" :locations="activeStations" />
  </div>
</template>
