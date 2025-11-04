<script setup lang="ts">
definePageMeta({
  middleware: 'i18n:messages',
  messages: ['scheduler'],
})

defineI18nRoute({
  paths: {
    de: '/partner-[partnerId]',
  },
})

const { t: schedulerT } = useMessages('scheduler')

const route = useRoute()
const partnerId = computed(() => route.params.partnerId as string)

const partner = ref<any | null>(null)

onMounted(async () => {
  try {
    const data = await $fetch<any[]>('/api/partners/public')
    const list = Array.isArray(data) ? data : []
    partner.value = list.find((p) => String(p.id) === String(partnerId.value)) || null
  } catch (e) {
    partner.value = null
  }
})

const title = computed(() => 'Cubee')
const cityName = computed(() => 'Cubee')

const { getPartnerCalendarUrl } = usePartnerBooking()
const calendarUrl = computed(() => getPartnerCalendarUrl(partnerId.value))
const address = computed(() => undefined)
const location = computed(() =>
  partner.value && (partner.value.lat ?? partner.value.latitude) !== undefined
    ? { lat: partner.value.lat ?? partner.value.latitude, lng: partner.value.lon ?? partner.value.lng }
    : undefined,
)
</script>

<template>
  <AppointmentView
    mode="driver"
    :title="title"
    :city-name="cityName"
    calendar-url="https://app.acuityscheduling.com/schedule.php?owner=33374738&calendarID=10852740"
    :address="address"
    :location="location"
  />
</template>


