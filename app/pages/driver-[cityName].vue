<script setup lang="ts">
import { useDriver } from '~/composables/useDrivers'

definePageMeta({
  middleware: 'i18n:messages',
  messages: ['scheduler'],
})

defineI18nRoute({
  paths: {
    de: '/mobiler-kfz-gutachter-[cityName]',
  },
})

const { t: schedulerT } = useMessages('scheduler')

const route = useRoute()

// Use the `slug` from the route params to find the station using the `useActiveStation` composable
const slug = computed(() => route.params.cityName as string)
const driver = useDriver(slug)

// First, try to get the city name from the station. If the station is not found, use the slug to generate the city name.
// This could be a nice SEO hack to cover _all_ the cities in the world, without having to manually add them to the station list.
const cityName = computed(
  () =>
    driver.value?.name ||
    slug.value
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' '),
)

// Access the `calendarUrl` and `address` from the reactive `station` ref
// Always use a `computed` to ensure that the value is reactive and updated when `station.value` changes
const calendarUrl = computed(() => driver.value?.url)
const address = computed(() => driver.value?.address)

useSeoMeta({
  // Using `() => schedulerT('$seo.title', { city: station.value.slug })` to ensure that the title is updated when the _reactive_ `cityName` changes
  title: () => schedulerT('$seo.title', { city: cityName.value }),
  ogTitle: () => schedulerT('$seo.title', { city: cityName.value }),
  description: () => schedulerT('$seo.desc', { city: cityName.value }),
  ogDescription: () => schedulerT('$seo.desc', { city: cityName.value }),
})

const localePath = useLocalePath()
</script>

<template>
  <!-- Set the station-[cityName] route as the canonical URL, to prevent duplicate content issues (SEO) -->
  <Link
    rel="canonical"
    :href="localePath({ name: 'station-cityName', params: { cityName } })"
  />

  <AppointmentView
    mode="driver"
    :title="schedulerT('$hero.driverTitle', { city: cityName })"
    :city-name="cityName"
    :calendar-url="calendarUrl"
    :address="address"
    :location="driver?.location"
  />
</template>
