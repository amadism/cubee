<script setup lang="ts">
const { station } = defineProps<{ station: InactiveStation }>()

const { t } = useMessages('finder')
const { t: appointmentT } = useMessages('appointment')
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>
        {{ appointmentT('$stations.name', { name: station.name }) }}
      </CardTitle>
    </CardHeader>

    <CardContent>
      <p class="text-sm font-medium text-gray-700">
        {{ t('comingSoon') }}
      </p>
    </CardContent>
  </Card>
</template>
