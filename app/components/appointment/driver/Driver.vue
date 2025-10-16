<script setup lang="ts">
import type { UserLocation } from '../location-selection'
import { faHandPointRight } from '@fortawesome/pro-solid-svg-icons'
import type { Driver } from '~/composables/useDrivers'

const localePath = useLocalePath()

const {
  driver,
  userLocation,
  highlight = false,
} = defineProps<{
  driver: Driver
  userLocation: UserLocation
  highlight?: boolean
}>()

const { t, messageNamespace } = useMessages('appointment')

const distance = useDistance(
  () => userLocation,
  () => driver.location,
)

const appointmentLink = computed(() =>
  localePath({
    name: 'driver-cityName',
    params: { cityName: driver.slug },
  }),
)
</script>

<template>
  <Card
    class="bg-gradient-to-br from-white to-yellow-50"
    :class="highlight ? 'border-2 border-yellow-500' : ''"
  >
    <CardHeader>
      <CardTitle>
        <div class="inline-flex items-center gap-2">
          <Icon icon="mdi:account-tie" class="h-8" />
          {{ t('$drivers.name', { name: driver.name }) }}
        </div>
      </CardTitle>
      <CardDescription class="font-semibold">
        {{ driver.address }}
      </CardDescription>
    </CardHeader>

    <CardContent class="space-y-2">
      <I18nT
        scope="global"
        :keypath="messageNamespace('$drivers.distance')"
        tag="p"
        class="font-medium"
      >
        <template #distance>
          <strong>{{ distance }}</strong>
        </template>
      </I18nT>

      <div class="space-y-2">
        <NuxtLink :to="appointmentLink" external class="block">
          <Button class="flex w-full gap-1.5" variant="primary">
            <Icon :icon="faHandPointRight" />
            {{ t('$drivers.cta') }}
          </Button>
        </NuxtLink>
      </div>
    </CardContent>
  </Card>
</template>
