<script lang="ts" setup>
import { useLocalePath, useSwitchLocalePath } from '#i18n'
import CubeeLogoFull from '@/assets/vectors/CubeeLogoFull.vue'
import { locales } from '@/config/i18n'
import { getCountryFlag } from '@cubee/app/composables/useCountryFlag'
import { faBars } from '@fortawesome/pro-regular-svg-icons'
import { faPhone } from '@fortawesome/pro-solid-svg-icons'

const route = useRoute()

const isFinderPage = computed(() => route.path === `/${locale.value}/finder` || route.path === '/finder')

const { t: globalT } = useMessages('global')
const localePath = useLocalePath()

const { locale: currentLocale } = useI18n()

const { localize } = useExtension()
const switchLocalePath = useSwitchLocalePath()

const locale = ref(currentLocale)
const localesList = locales.map((locale) => locale.code)

async function switchLocale(locale: string) {
  const { query } = useRoute()

  await localize(locale)
  await navigateTo({ hash: '' }, { replace: true })
  await navigateTo({ path: switchLocalePath(locale), query })
}

watch(locale, (newLocale) => {
  if (newLocale) {
    switchLocale(newLocale)
  }
})

const [menuOpen, toggleMenu] = useToggle()

const router = useRouter()

router.beforeEach(() => {
  toggleMenu(false)
  return true
})
</script>

<template>
  <header class="p-4 md:py-6">
    <div class="mx-auto max-w-6xl">
      <div class="flex justify-between">
        <div class="flex-1">
          <NuxtLink :to="localePath('/')" class="inline-flex">
            <CubeeLogoFull size="200" />
          </NuxtLink>
        </div>

        <div
          class="hidden flex-1 items-center justify-center font-medium 2xl:flex"
        >
          <div>
            <Icon :icon="faPhone" />
            <a href="tel:08002823333" class="ml-2">0800 - 2823333</a>
          </div>
        </div>

        <div class="hidden flex-1 text-center md:block">
          <div class="flex items-center justify-end gap-4 whitespace-nowrap font-medium">
            <NuxtLink :to="localePath({ name: 'finder' })" class="no-deco">
              {{ globalT('finder') }}
            </NuxtLink>
            <NuxtLink :to="localePath({ name: 'about' })" class="no-deco">
              {{ globalT('about') }}
            </NuxtLink>

            <div>
              <NuxtLink :to="localePath({ name: 'contact', query: { type: 'inquiry' } })" class="no-deco">
                  <span v-text="globalT('contact')" />
              </NuxtLink>
            </div>
            <div>
              <NuxtLink v-show="!isFinderPage" :to="localePath({ name: 'contact', query: { type: 'partner_request' } })" class="no-deco">
                <Button class="font-semibold" variant="primary">
                  {{ globalT('becomePartner') }}
                </Button>
              </NuxtLink>
            </div>
            <div>
              <Select v-model="locale">
                <SelectTrigger class="w-auto">
                  <SelectValue :placeholder="globalT('lang')" />
                </SelectTrigger>
                <SelectContent>
                  <template v-for="locale in localesList" :key="locale">
                    <SelectItem :value="locale">
                      {{ getCountryFlag(locale) }}
                      {{ globalT(`$lang.${locale}`) }}
                    </SelectItem>
                  </template>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div class="grid items-center md:hidden">
          <Drawer v-model:open="menuOpen">
            <DrawerTrigger>
              <Icon :icon="faBars" class="text-2xl" />
            </DrawerTrigger>

            <DrawerContent>
              <DrawerHeader>
                <a href="tel:0800 - 2823333" class="inline-flex">
                  <Button variant="outline" class="gap-2">
                    <Icon :icon="faPhone" />
                    0800 - 2823333
                  </Button>
                </a>
              </DrawerHeader>

              <div class="grid gap-4 p-4 font-medium">
                <NuxtLink class="no-deco" :to="localePath({ name: 'finder' })">
                  <span v-text="globalT('finder')" />
                </NuxtLink>
                <NuxtLink class="no-deco" :to="localePath({ name: 'about' })">
                  <span v-text="globalT('about')" />
                </NuxtLink>
              <NuxtLink :to="localePath({ name: 'contact', query: { type: 'inquiry' } })" class="flex">
                  <Button class="w-full font-semibold">
                    <span v-text="globalT('contact')" />
                  </Button>
                </NuxtLink>

              <NuxtLink :to="localePath({ name: 'contact', query: { type: 'partner_request' } })" class="flex">
                <Button class="w-full font-semibold" variant="primary">
                  {{ globalT('becomePartner') }}
                </Button>
              </NuxtLink>

                <Select v-model="locale">
                  <SelectTrigger class="w-auto">
                    <SelectValue :placeholder="globalT('lang')" />
                  </SelectTrigger>
                  <SelectContent>
                    <template v-for="locale in localesList" :key="locale">
                      <SelectItem :value="locale">
                        {{ getCountryFlag(locale) }}
                        {{ globalT(`$lang.${locale}`) }}
                      </SelectItem>
                    </template>
                  </SelectContent>
                </Select>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  </header>
</template>
