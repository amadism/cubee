<script setup lang="ts">
const localePath   = useLocalePath()
const { t: homeT } = useMessages('home')
</script>

<template>
  <NuxtLink
    :to="
      localePath({ name: 'report-submit' })
    "
    class="!mt-8 flex w-full"
  >
    <Button
      class="bg-animated-gradient flex h-auto w-full flex-col items-center whitespace-normal p-4 text-yellow-950 transition-transform duration-300 hover:scale-105"
    >
              <span
                class="text-xl font-bold text-gray-900"
                v-text="homeT('$hero.cta:title')"
              />
      <span
        class="text-xs md:text-sm"
        v-text="homeT('$hero.cta:subtitle')"
      />
    </Button>
  </NuxtLink>


  <!-- <div class="space-y-2">

    <NuxtLink
      :to="
                localePath({ name: 'report-submit' })
              "
      class="flex w-full"
    >
      <Button
        class="flex h-auto w-full flex-col items-center whitespace-normal p-4 transition-transform duration-300"
        variant="outline"
      >
                <span
                  class="text-lg font-bold"
                  v-text="homeT('$hero.mobile:title')"
                />
        <span
          class="text-xs text-yellow-950 md:text-sm"
          v-text="homeT('$hero.mobile:subtitle')"
        />
      </Button>
    </NuxtLink>
  </div> -->
</template>

<style scoped lang="postcss">
.bg-animated-gradient {
  background: linear-gradient(45deg, #e6b606, #ffd505, #cc9b0a);
  /* background: linear-gradient(45deg, #ab8600, #cc9e01, #8b6906); */
  /* background: linear-gradient(45deg, #ab8600, #cc9e01, #ae8307); */
  background-size: 200% 200%;
  animation: gradientAnimation 3s ease infinite alternate;
}

@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%; /* Start from the left */
  }
  100% {
    background-position: 100% 50%; /* Move to the right */
  }
}
</style>