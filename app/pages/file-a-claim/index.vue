<script setup lang="ts">
import insuranceCompaniesData from '@/assets/insurance/insurance-companies.json'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { Check, ChevronsUpDown } from 'lucide-vue-next'

interface InsuranceCompany {
  name: string
  slug: string
  imageUrl: string
  email: string
  colors: {
    primary: string
    secondary: string
  }
}

const insuranceCompanies: InsuranceCompany[] =
  insuranceCompaniesData as InsuranceCompany[]

const open = ref(false)
const value = ref('')

const truncatedValue = computed(() => {
  const selectedCompany = insuranceCompanies.find(
    (company) => company.slug === value.value,
  )
  if (selectedCompany && selectedCompany.name.length > 28) {
    return `${selectedCompany.name.substring(0, 28)}...`
  }
  return selectedCompany ? selectedCompany.name : 'Versicherung Auswählen'
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-4 py-4 md:py-16 lg:px-0">
    <div
      class="flex flex-col-reverse items-center justify-center gap-8 md:flex-row"
    >
      <div class="flex max-w-2xl flex-col gap-2 md:gap-4">
        <h1
          class="hyphens-auto text-balance text-2xl font-semibold !leading-snug lg:text-4xl"
        >
          Schnell, bequem, online – Jetzt Kfz-Schaden melden!
        </h1>
        <p class="font-medium !leading-relaxed md:text-lg">
          Willkommen beim Cubee Schadenmelder! Mit nur wenigen Klicks können Sie
          hier jeden Kfz-Schaden für sämtliche Versicherungen in Deutschland
          melden. Starten Sie einfach, indem Sie Ihre Versicherung auswählen.
        </p>
        <div class="flex flex-col gap-2 py-6">
          <Popover v-model:open="open">
            <PopoverTrigger as-child>
              <Button
                variant="outline"
                role="combobox"
                :aria-expanded="open"
                class="w-full justify-between md:w-96 md:max-w-96"
              >
                {{ value ? truncatedValue : 'Versicherung Auswählen' }}

                <ChevronsUpDown class="ml-2 h-5 w-5 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent class="w-full md:w-96 md:max-w-none">
              <Command v-model="value">
                <CommandInput placeholder="Versicherung Suchen..." />
                <CommandEmpty>No framework found.</CommandEmpty>
                <CommandList>
                  <CommandGroup>
                    <CommandItem
                      v-for="company in insuranceCompanies"
                      :key="company.slug"
                      :value="company.slug"
                      @select="open = false"
                    >
                      <Check
                        :class="
                          cn(
                            'mr-2 h-4 w-4',
                            value === company.slug
                              ? 'opacity-100'
                              : 'opacity-0',
                          )
                        "
                      />
                      {{ company.name }}
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          <Button
            variant="primary"
            class="w-full py-6 md:max-w-96 md:text-lg"
            :disabled="!value"
            @click="navigateTo(`/file-a-claim/${value}`)"
          >
            Weiter
          </Button>
        </div>
      </div>
      <NuxtImg alt="Computer" src="/img/pc.jpg" class="max-h-56 md:max-h-72" />
    </div>
  </div>
</template>
