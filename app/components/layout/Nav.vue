<script lang="ts" setup>

const emit = defineEmits<{ (event: 'routeSelected', value: any): void }>()

const route = useRoute()

const currentPath = computed(() => {
  if (route.params.slug as string) {
    return ''
  }
  return route.params.slug
})

const items = [
  {
    id: 1,
    name: 'Home',
    path: 'home',
  },
  {
    id: 2,
    name: 'About',
    path: 'about',
  },
  {
    id: 3,
    name: 'Service',
    path: 'service',
  },
  {
    id: 4,
    name: 'Advantage',
    path: 'advantage',
  },
  {
    id: 5,
    name: 'Contact Us',
    path: 'contact-us',
  },
];
</script>

<template>
  <div class="relative overflow-hidden">
    <LayoutLanguageSelection
      class="md:hidden"
      @language-switched="emit('routeSelected', $event)"
    />
    <nav :class="$style.nav">
      <div :class="$style.links">
        <NuxtLink
          v-for="item in items"
          :key="item.id"
          :to="item.path"
          :class="[currentPath === item.path ? $style.currentLink : $style.link]"
          @click="emit('routeSelected', item.path)"
          >{{ item.name }}</NuxtLink
        >
      </div>
    </nav>

    <div :class="$style.gradient" />
  </div>
</template>

<style lang="postcss" module>
.nav {
  @apply md:-mx-4 md:overflow-x-auto my-2 md:my-0;
}

.links {
  @apply flex flex-col divide-y text-primary-800 hover:text-primary-600;
  @apply md:flex-row md:divide-y-0;
}

.link {
  @apply py-3 md:px-4 pl-4;
  @apply whitespace-nowrap md:text-sm hover:underline hover:text-primary-600;
}

.currentLink {
  @apply py-3 md:px-4 pl-4;
  @apply whitespace-nowrap md:text-sm font-semibold;
}

.gradient {
  @apply absolute right-0 inset-y-0 w-16 bg-gradient-to-l from-white to-white/0;
  @apply hidden md:block;
}
</style>
