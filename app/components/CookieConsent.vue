<script setup lang="ts">
import type { GTag } from 'third-party-capital'
import { faCookieBite } from '@fortawesome/pro-regular-svg-icons'
import { useToggle } from '@vueuse/core'
import { Dialog, DialogFooter, DialogHeader } from '~/components/ui/dialog'
import { agreedToCookiesScriptConsent } from '~/utils/cookie'

const { t, messageNamespace } = useMessages('global')

const localePath = useLocalePath()

const config = useRuntimeConfig()
const { proxy: gtm } = useScriptGoogleTagManager({
  id: config.public.scripts.registry.googleTagManager.id,
  scriptOptions: {
    trigger: agreedToCookiesScriptConsent,
  },
  scriptInput: {
    // @ts-expect-error type error
    crossorigin: false,
    // @ts-expect-error type error
    referrerpolicy: false,
  },
})

const { proxy: analytics } = useScriptGoogleAnalytics({
  id: config.public.scripts.registry.googleAnalytics.id,
  scriptOptions: {
    trigger: agreedToCookiesScriptConsent,
  },
})

// const fb = useFacebookPixel()
const router = useRouter()

const isPrivacyPage = computed(() =>
  String(router.currentRoute.value.name).startsWith('privacy__'),
)

const [customizeActive, toggleCustomize] = useToggle(false)

function toGrantValue(value: boolean) {
  return value ? 'granted' : 'denied'
}

const personalized = useCookie<'denied' | 'granted'>('cookies.personalized', {
  default: () => 'denied',
})
const statistics = useCookie<'denied' | 'granted'>('cookies.statistics', {
  default: () => 'denied',
})
const marketing = useCookie<'denied' | 'granted'>('cookies.marketing', {
  default: () => 'denied',
})

const configured = useCookie('cookies.configured', { default: () => false })

const active = ref(!configured.value)

function updateConsent() {
  gtm.dataLayer.push({
    event: 'consent-update',
    value: {
      ad_storage: marketing.value,
      ad_user_data: marketing.value,
      ad_personalization: personalized.value,
      analytics_storage: statistics.value,
    },
  })

  const gtag: GTag = analytics.gtag as unknown as GTag

  gtag('consent', 'update', {
    ad_storage: marketing.value,
    ad_user_data: marketing.value,
    ad_personalization: personalized.value,
    analytics_storage: statistics.value,
  })
}

function initTracking() {
  agreedToCookiesScriptConsent.accept()

  // gtm?.enable()

  // fb.init({ trackPageView: true })
  // gtm?.trackView(
  //   String(router.currentRoute.value.name || router.currentRoute.value.path),
  //   router.currentRoute.value.path,
  // )
}

const consents = reactive({
  personalized: personalized.value === 'granted',
  statistics: statistics.value === 'granted',
  marketing: marketing.value === 'granted',
} as Record<'personalized' | 'statistics' | 'marketing', boolean>)

function submit(options?: { acceptAll?: boolean }) {
  if (options?.acceptAll) {
    consents.personalized = true
    consents.statistics = true
    consents.marketing = true
  }

  personalized.value = toGrantValue(consents.personalized)
  statistics.value = toGrantValue(consents.statistics)
  marketing.value = toGrantValue(consents.marketing)
  configured.value = true

  updateConsent()
  initTracking()

  active.value = false
}

onMounted(() => {
  requestIdleCallback(() => {
    if (configured.value) {
      initTracking()
    }
  })
})

const { isMobile } = useDevice()
</script>

<template>
  <Dialog :open="active && !isPrivacyPage">
    <DialogContent
      class="rounded-lg bg-gray-50 p-6"
      :attach="isMobile ? 'bottom' : undefined"
      :closeable="false"
      :animate-in="false"
    >
      <DialogHeader>
        <DialogTitle class="flex gap-2">
          <Icon :icon="faCookieBite" />
          {{ t('$cookies.title') }}
        </DialogTitle>
        <DialogDescription class="text-left font-medium">
          {{ t('$cookies.subtitle') }}
        </DialogDescription>
      </DialogHeader>

      <TransitionExpand mode="out-in" :duration="200">
        <I18nT
          v-if="!customizeActive"
          tag="p"
          :keypath="messageNamespace('$cookies.text')"
          class="hyphens-auto text-sm font-medium"
          scope="global"
        >
          <template #privacy>
            <NuxtLink
              :to="localePath({ name: 'privacy' })"
              class="font-semibold duration-150 hover:underline"
            >
              {{ t('$cookies.text:privacy') }}
            </NuxtLink>
          </template>
        </I18nT>

        <div v-else>
          <ul class="flex flex-col gap-2">
            <li class="flex items-center gap-2">
              <Checkbox class="pointer-events-none" checked />
              <span
                class="text-sm font-semibold"
                v-text="t('$cookies.$consents.essential')"
              />
            </li>

            <li
              class="flex items-center gap-2"
              @click="consents.statistics = !consents.statistics"
            >
              <Checkbox :checked="consents.statistics" />
              <span
                class="text-sm font-semibold"
                v-text="t('$cookies.$consents.statistics')"
              />
            </li>

            <li
              class="flex items-center gap-2"
              @click="consents.personalized = !consents.personalized"
            >
              <Checkbox :checked="consents.personalized" />
              <span
                class="text-sm font-semibold"
                v-text="t('$cookies.$consents.personalized')"
              />
            </li>

            <li
              class="flex items-center gap-2"
              @click="consents.marketing = !consents.marketing"
            >
              <Checkbox :checked="consents.marketing" />
              <span
                class="text-sm font-semibold"
                v-text="t('$cookies.$consents.marketing')"
              />
            </li>
          </ul>
        </div>
      </TransitionExpand>

      <DialogFooter>
        <Button variant="primary" @click="submit({ acceptAll: true })">
          {{
            customizeActive ? t('$cookies.accept-all') : t('$cookies.accept')
          }}
        </Button>
        <Button
          variant="outline"
          @click="
            () => {
              if (customizeActive) {
                submit()
                return
              }
              toggleCustomize()
            }
          "
        >
          {{
            customizeActive
              ? t('$cookies.accept-selection')
              : t('$cookies.customize')
          }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
