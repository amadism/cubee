<script
  setup
  lang="ts"
  generic="
    TLocation extends { id: unknown; location: { lat: number; lng: number } }
  "
>
import PartnersMap from '~/components/partners-map/PartnersMap.vue'

const { locations } = defineProps<{
  locations?: TLocation[]
  mode?: string
}>()

type Partner = { id: string; location: { lat: number; lng: number } }

const partners = ref<Partner[]>([])

onMounted(async () => {
  if (locations?.length) {
    partners.value = locations.map((loc) => ({
      id: String((loc as any).id),
      location: { lat: loc.location.lat, lng: loc.location.lng },
    })) as unknown as Partner[]
    return
  }
  try {
    const data = await $fetch<any[]>('/api/partners/public')
    partners.value = ((data || []).map((p) => ({
      id: String(p.id),
      location: { lat: p.lat ?? p.latitude, lng: p.lon ?? p.lng },
    })) as unknown) as Partner[]
  } catch (e) {
    partners.value = []
  }
})
</script>

<template>
  <div class="h-[65vh] overflow-hidden rounded-lg">
    <PartnersMap :partners="partners" />
  </div>
</template>
