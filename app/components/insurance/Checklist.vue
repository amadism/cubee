<script lang="ts" setup>
import { faBallotCheck, faCheck } from '@fortawesome/pro-duotone-svg-icons'

defineProps({
  iconColor: {
    type: String,
    default: 'black',
  },
  accentColor: {
    type: String,
    default: 'black',
  },
})
</script>

<template>
  <div
    class="mx-4 flex max-w-4xl flex-col gap-6 rounded-md border px-6 py-8 shadow-sm md:mx-auto md:flex-row md:items-center lg:gap-8 lg:px-8"
  >
    <Icon
      :icon="faBallotCheck"
      class="text-6xl"
      :style="{ color: iconColor }"
    />
    <div class="flex flex-col gap-2">
      <p class="text-xl font-semibold lg:text-2xl">Schadenmeldung-Checkliste</p>
      <p>
        Für eine reibungslose Schadenmeldung halten Sie bitte folgende
        Informationen bereit:
      </p>
      <ul class="flex flex-col gap-1">
        <li class="flex gap-1 text-lg font-semibold">
          <Icon
            :icon="faCheck"
            class="mr-2 mt-1"
            :style="{ color: accentColor }"
          />
          Kennzeichen der beteiligten Kfz
        </li>
        <li class="flex gap-1 text-lg font-semibold">
          <Icon
            :icon="faCheck"
            class="mr-2 mt-1"
            :style="{ color: accentColor }"
          />
          Name, Anschrift, Email und/oder Telefonnummer der Unfallgegner
        </li>
        <li class="text-lg font-semibold">
          <Icon :icon="faCheck" class="mr-2" :style="{ color: accentColor }" />
          Versicherungsnummer
        </li>
      </ul>
    </div>
  </div>
</template>
