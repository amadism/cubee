<script lang="ts" setup>
import insuranceCompaniesData from '@/assets/insurance/insurance-companies.json'

definePageMeta({
  layout: 'insurance',
})

interface InsuranceCompany {
  name: string
  slug: string
  imageUrl: string
  email: string
  colors: {
    primary: string
    secondary: string
  }
  headerStyle: string
}

const insuranceCompanies: InsuranceCompany[] =
  insuranceCompaniesData as InsuranceCompany[]

const route = useRoute()
const slug = computed(() => route.params.insurance as string)

const insuranceCompany = computed(() => {
  const company = insuranceCompanies.find(
    (company) => company.slug === slug.value,
  )
  if (!company) {
    throw createError({
      statusCode: 404,
      statusMessage: `Page Not Found: /file-a-claim/${slug.value}`,
      fatal: true,
    })
  }
  return company
})

// const bgColor = computed(() => {
//   return `bg-[${insuranceCompany.value.colors.primary}]`
// })
</script>

<template>
  <div class="mb-24">
    <div
      :style="{
        backgroundColor:
          insuranceCompany.headerStyle === 'white'
            ? ''
            : insuranceCompany.colors.primary,
      }"
    >
      <div
        class="mx-auto flex max-w-6xl flex-row items-center justify-between px-4 py-4 lg:py-6"
      >
        <NuxtImg
          class="h-7 max-w-56 lg:h-14"
          :src="insuranceCompany.imageUrl"
          :alt="`Logo der ${insuranceCompany.name}`"
        >
        </NuxtImg>
        <p
          class="font-semibold lg:text-xl"
          :style="{
            color:
              insuranceCompany.headerStyle === 'color'
                ? 'black'
                : insuranceCompany.headerStyle === 'color-white'
                  ? 'white'
                  : insuranceCompany.colors.primary,
          }"
        >
          KFZ-Schadenmeldung
        </p>
      </div>
    </div>
    <InsuranceChecklist
      class="mt-8"
      :icon-color="insuranceCompany.colors.primary"
      :accent-color="insuranceCompany.colors.secondary"
    />
    <InsuranceQuestionaire
      :icon-color="insuranceCompany.colors.primary"
      :accent-color="insuranceCompany.colors.secondary"
    />
  </div>
</template>
