<script lang="ts" setup>
const { locale } = useI18n()

const { data: doc } = useAsyncData(`privacy:${locale.value}`, async () => {
  try {
    return await queryContent(`privacy/${locale.value}`).findOne()
  } catch (e) {
    return await queryContent(`privacy/de`).findOne()
  }
})

defineI18nRoute({
  paths: {
    de: '/datenschutz',
  },
})
</script>

<template>
  <div class="page-container content">
    <div class="section">
      <ContentRenderer v-if="doc" :value="doc" />
    </div>
  </div>
</template>
