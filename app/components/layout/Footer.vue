<script lang="ts" setup>
import { useLocalePath } from '#i18n'
import {
  faAt,
  faEnvelope,
  faUserHeadset,
} from '@fortawesome/pro-regular-svg-icons'
import CubeeLogoFull from 'assets/vectors/CubeeLogoFull.vue'

const { t: globalT } = useMessages('global')
const localePath = useLocalePath()
</script>

<template>
  <footer class="border-t p-5 sm:py-12">
    <div class="mx-auto grid max-w-6xl gap-8 lg:grid-cols-4 lg:gap-24">
      <div>
        <NuxtLink :to="localePath('/')" class="inline-flex max-h-12">
          <CubeeLogoFull class="-translate-x-8" />
        </NuxtLink>
      </div>

      <div class="grid gap-8 text-sm font-medium lg:col-span-3 lg:grid-cols-3">
        <nav>
          <ul class="space-y-2">
            <li>
              <NuxtLink :to="localePath('/')">
                {{ globalT('home') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath({ name: 'about' })">
                {{ globalT('$footer.aboutCubee') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath({ name: 'finder' })">
                {{ globalT('$footer.locationFinder') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath({ name: 'contact' })">
                {{ globalT('$footer.contact') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath({ name: 'contact' })">
                {{ globalT('$footer.jobs') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath({ name: 'contact' })">
                {{ globalT('$footer.becomeFranchisee') }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <nav>
          <h3
            class="text-base font-semibold"
            v-text="globalT('$footer.companyHeading')"
          />

          <ul class="mt-2 space-y-2">
            <li>
              <NuxtLink :to="localePath({ name: 'legal' })">
                {{ globalT('$footer.legalNotice') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath({ name: 'legal' })">
                <span>AGB</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath({ name: 'privacy' })">
                {{ globalT('$footer.tos') }}
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="localePath({ name: 'privacy' })">
                {{ globalT('$footer.privacyPolicy') }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <!-- <nav>
          <h3
            class="text-base font-semibold"
            v-text="globalT('$footer.followUs')"
          />

          <ul class="mt-2 space-y-2">
            <li>
              <NuxtLink to="#">
                <Icon :icon="faFacebook" />
                <span class="ml-2" v-text="globalT('$socialMedia.facebook')" />
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="#">
                <Icon :icon="faTwitter" />
                <span class="ml-2" v-text="globalT('$socialMedia.twitter')" />
              </NuxtLink>
            </li>
          </ul>
        </nav> -->

        <div>
          <h3
            class="text-base font-semibold"
            v-text="globalT('$footer.contact')"
          />

          <ul class="mt-2 space-y-2">
            <li>
              <a href="mailto:hello@cubee.expert">
                <Icon :icon="faAt" class="inline-flex w-6 justify-center" />
                hello@cubee.expert
              </a>
            </li>
            <li>
              <a href="tel:08002823333">
                <Icon
                  :icon="faUserHeadset"
                  class="inline-flex w-6 justify-center"
                />
                0800 - 2823333
              </a>
            </li>
          </ul>
        </div>
      </div>

      <p class="col-span-full border-t pt-2 text-xs font-medium md:text-right">
        © {{ new Date().getFullYear() }}
        Cubee Sachverständigen AG
      </p>
    </div>
  </footer>
</template>
