<script setup lang="ts">
import Schedule from '~/components/appointment/acuity/Schedule.vue'
import ReturnButton from '~/components/appointment/global/ReturnButton.vue'

const { station } = defineProps<{ station: Station }>()

const emit = defineEmits<{ back: [] }>()
</script>

<template>
  <div class="w-full">
    <div @click="emit('back')">
      <ReturnButton label="Return" />
    </div>

    <Schedule :url="station.url" />
  </div>
</template>
