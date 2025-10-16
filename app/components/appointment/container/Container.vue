<script setup lang="ts">
import type { UserLocation } from '@/components/appointment/location-selection'
import { faLocationDot } from '@fortawesome/pro-regular-svg-icons'
import { faHandPointRight } from '@fortawesome/pro-solid-svg-icons'

const {
  station,
  userLocation,
  highlight = false,
} = defineProps<{
  station: ActiveStation
  userLocation?: UserLocation
  highlight?: boolean
}>()

const distance = useDistance(
  () => station.location,
  () => userLocation,
)

const formatOpenHours = useFormatOpenHours()

const { t } = useMessages('appointment')

const localePath = useLocalePath()

const appointmentLink = computed(() =>
  localePath({
    name: 'station-cityName',
    params: { cityName: station.slug },
  }),
)
</script>

<template>
  <Card
    class="bg-gradient-to-br from-white to-yellow-50"
    :class="highlight ? 'scale-[1.02] border-yellow-500 shadow-lg' : ''"
  >
    <CardHeader>
      <CardTitle>
        <NuxtLink :to="appointmentLink" class="inline-flex items-center gap-2">
          <BrandLogoBee class="h-8" />
          {{ t('$stations.name', { name: station.name }) }}
        </NuxtLink>
      </CardTitle>
      <CardDescription class="font-semibold">
        {{ station.address }}
      </CardDescription>
    </CardHeader>

    <CardContent class="space-y-4">
      <div class="flex flex-wrap gap-1">
        <Badge
          v-if="userLocation"
          variant="outline"
          class="bg-white text-gray-700"
        >
          {{ t('$stations.distance', { distance }) }}
        </Badge>

        <Badge variant="outline" class="bg-white text-gray-700">
          {{
            t('$stations.opening-hours', {
              hours: formatOpenHours(station.openHours),
            })
          }}
        </Badge>
      </div>

      <div class="space-y-2">
        <NuxtLink :to="appointmentLink" external class="block">
          <Button class="flex w-full gap-1.5" variant="primary">
            <Icon :icon="faHandPointRight" />
            {{ t('$stations.schedule-now') }}
          </Button>
        </NuxtLink>

        <NuxtLink
          :to="`https://maps.google.com/?daddr=${station.address}`"
          target="_blank"
          external
          class="block"
        >
          <Button class="flex w-full gap-1.5" variant="outline" size="sm">
            <Icon :icon="faLocationDot" />
            {{ t('$stations.google-maps') }}
          </Button>
        </NuxtLink>
      </div>
    </CardContent>
  </Card>
</template>
