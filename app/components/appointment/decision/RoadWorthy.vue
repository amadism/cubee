<script setup lang="ts">
import type { UserLocation } from '../location-selection'
import ContainerList from '~/components/appointment/container/ContainerList.vue'
import LocationSelection from '~/components/appointment/location-selection/LocationSelection.vue'

const userLocation = shallowRef<UserLocation>()
</script>

<template>
  <LocationSelection v-if="!userLocation" v-model="userLocation" />
  <ContainerList
    v-else
    :user-location="userLocation"
    @back="userLocation = undefined"
  />
</template>
