<script setup lang="ts">
import { faStar } from '@fortawesome/pro-solid-svg-icons'

const { t } = useMessages('home')
</script>

<template>
  <div class="relative space-y-8 py-2 md:py-4">
    <!-- <div
      class="bg-extended bg-lightblue-200 border-t-32 border-b-32 border-lightblue-50 h-32"
    /> -->
    <div class="section space-y-8">
      <h2
        class="text-xl font-semibold md:text-2xl"
        v-text="t('$reviews.title')"
      />

      <Carousel class="xl:-mx-8 2xl:-mx-24" :opts="{ align: 'start' }">
        <CarouselContent>
          <CarouselItem
            v-for="key in Array.from({ length: 10 }, (_, index) => index)"
            :key="key"
            class="basis-4/5 xl:basis-1/2 2xl:basis-1/3"
          >
            <Card>
              <CardHeader>
                <CardTitle class="line-clamp-2 h-12 text-base">
                  {{ t(`$reviews.list.${key}.title`) }}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div class="flex gap-1 text-sm">
                  <Icon
                    v-for="n in parseInt(t(`$reviews.list.${key}.stars`))"
                    :key="n"
                    :icon="faStar"
                  />
                </div>

                <p
                  class="border-lightblue-200 mt-2 border-b-2 pb-4 text-sm font-medium leading-relaxed md:pb-6"
                  v-text="t(`$reviews.list.${key}.content`)"
                />

                <div class="mt-4 flex items-center justify-end gap-2 text-sm">
                  <span
                    class="font-semibold"
                    v-text="t(`$reviews.list.${key}.name`)"
                  />
                  <!-- <span>- {{ t(`$reviews.list.${key}.date`) }}</span> -->
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>

        <CarouselPrevious class="hidden md:flex" />
        <CarouselNext class="hidden md:flex" />
      </Carousel>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.bg-extended {
  position: absolute;
  z-index: -1;
  width: 100vw;
  height: 100%;
  top: 0;
  left: calc(-50vw + 50%);
  right: 0;
}
</style>
