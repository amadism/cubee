<script setup lang="ts">
const { locale } = useI18n()

onMounted(() => {
  const script = document.createElement('script')
  script.src =
    'https://widget.superchat.de/snippet.js?applicationKey=WC5l4bpoJkV9mwebByaqWLN7KA'
  script.referrerPolicy = 'no-referrer-when-downgrade'
  document.body.appendChild(script)
})
</script>

<template>
  <div>
    <LayoutHeader />

    <slot />

    <ClientOnly>
      <CookieConsent />
    </ClientOnly>

    <LayoutFooter class="footer" />
  </div>
</template>

<style lang="postcss">
.page-enter-active,
.page-leave-active {
  transition: all 250ms ease-in-out;
}
.page-enter-from {
  @apply -translate-y-10 opacity-0;
}
.page-leave-to {
  @apply -translate-y-10 opacity-0;
}
</style>
