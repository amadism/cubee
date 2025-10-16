<script lang="ts" setup>
const config = useRuntimeConfig()

const { proxy: analytics } = useScriptGoogleAnalytics({
  id: config.public.scripts.registry.googleAnalytics.id,
  scriptOptions: {
    trigger: agreedToCookiesScriptConsent,
  },
})

const router = useRouter()

router.afterEach(() => analytics.dataLayer.push({ event: 'page_view' }))

useSeoMeta({ titleTemplate: '%s' })

const head = useLocaleHead({
  lang: true,
  dir: true,
  identifierAttribute: 'id',
  addSeoAttributes: true,
})

useHead(head)
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
