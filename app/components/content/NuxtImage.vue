<template>
  <nuxt-img class="rounded-lg my-6" :src="src" :alt="alt" />
</template>

<script setup>
defineProps({
  src: {
    type: String,
    default: ''
  },
  alt: {
    type: String,
    default: ''
  }
})
</script>