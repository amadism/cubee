<script setup>
defineProps({
    img: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    }
})
</script>

<template>
    <img
      :src="img"
      alt="Description of image"
      class="h-16 md:h-20 lg:h-24"
    />
    <span class="text-sm md:text-base lg:text-lg">{{ text }}</span>
  </template>
  