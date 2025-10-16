<script setup>
import Appointment from '~/components/appointment/Appointment.vue'

definePageMeta({
  middleware: ['i18n:messages'],
  messages: ['appointment'],
})

defineI18nRoute({
  paths: {
    de: '/termin',
  },
})
</script>

<template>
  <Appointment />
</template>
