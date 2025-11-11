<script setup lang="ts">
import type { UserLocation } from '@/components/appointment/location-selection'
import { faLocationDot } from '@fortawesome/pro-regular-svg-icons'
import { faHandPointRight } from '@fortawesome/pro-solid-svg-icons'

type PartnerPublic = {
  id: string | number
  location: { lat: number; lng: number }
  name?: string
  location_name?: string
}

const props = defineProps<{
  station?: ActiveStation
  partner?: PartnerPublic
  userLocation?: UserLocation
  highlight?: boolean
}>()

const locationForDistance = computed(() =>
  props.station ? props.station.location : props.partner?.location,
)

const distance = useDistance(
  () => locationForDistance.value as any,
  () => props.userLocation,
)

const formatOpenHours = useFormatOpenHours()

const { t } = useMessages('appointment')

const localePath = useLocalePath()

const appointmentLink = computed(() =>
  props.station
    ? localePath({
        name: 'station-cityName',
        params: { cityName: props.station.slug },
      })
    : undefined,
)
</script>

<template>
  <Card
    class="bg-gradient-to-br from-white to-yellow-50"
    :class="(props.highlight ?? false) ? 'scale-[1.02] border-yellow-500 shadow-lg' : ''"
  >
    <CardHeader>
      <CardTitle>
        <template v-if="props.partner">
          <div class="inline-flex items-center gap-2">
            <BrandLogoBee class="h-8" />
            <span>
              {{ t('$stations.partner-label') }} {{ props.partner?.location_name?.replace(/, Germany$/, '') }}
            </span>
          </div>
        </template>
      </CardTitle>
    </CardHeader>

    <CardContent class="space-y-4 -mt-6">
      <div class="flex flex-wrap gap-1">
        <Badge
          v-if="props.userLocation"
          variant="outline"
          class="bg-white text-gray-700"
        >
          {{ t('$stations.distance', { distance }) }}
        </Badge>

        <Badge v-if="props.station" variant="outline" class="bg-white text-gray-700">
          {{
            t('$stations.opening-hours', {
              hours: formatOpenHours(props.station.openHours),
            })
          }}
        </Badge>
      </div>

      <div class="space-y-2">
        <template v-if="props.station">
          <NuxtLink :to="appointmentLink" external class="block">
            <Button class="flex w-full gap-1.5" variant="primary">
              <Icon :icon="faHandPointRight" />
              {{ t('$stations.schedule-now') }}
            </Button>
          </NuxtLink>

          <!-- <NuxtLink
            :to="`https://maps.google.com/?daddr=${props.station.address}`"
            target="_blank"
            external
            class="block"
          >
            <Button class="flex w-full gap-1.5" variant="outline" size="sm">
              <Icon :icon="faLocationDot" />
              {{ t('$stations.google-maps') }}
            </Button>
          </NuxtLink> -->
        </template>
        <template v-else>
          <NuxtLink :to="localePath({ name: 'partner-partnerId', params: { partnerId: String(props.partner?.id) } })" external class="block">
            <Button class="flex w-full gap-1.5" variant="primary">
              <Icon :icon="faHandPointRight" />
              {{ t('$stations.schedule-now') }}
            </Button>
          </NuxtLink>

          <!-- <NuxtLink
            :to="`https://www.google.com/maps/search/?api=1&query=${props.partner?.location.lat},${props.partner?.location.lng}`"
            target="_blank"
            external
            class="block"
          >
            <Button class="flex w-full gap-1.5" variant="outline" size="sm">
              <Icon :icon="faLocationDot" />
              {{ t('$stations.google-maps') }}
            </Button>
          </NuxtLink> -->
        </template>
      </div>
    </CardContent>
  </Card>
</template>
