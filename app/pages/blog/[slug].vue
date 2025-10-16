<script setup lang="ts">
import { fetchBlogPost } from '@/blog/post'
import { faPersonWalkingArrowLoopLeft } from '@fortawesome/pro-solid-svg-icons'
import RelatedArticles from '~/components/content/RelatedArticles.vue'

const { t: blogT } = useMessages('blog')
const localePath = useLocalePath()

definePageMeta({
  async validate({ params }) {
    const { $router } = useNuxtApp()

    // validate() and vue-i18n have a bug (?) where $i18n.locale is not updated
    // yet when coming from another route, so we check if there is a
    // "currentRoute" (previous route) and if so, we don't try to validate the post.
    // This is only important for SEO anyway, so it's not a big deal.
    if ($router.currentRoute.value) {
      return true
    }

    try {
      await fetchBlogPost(params.slug as string)
      return true
    } catch (e) {
      return false
    }
  },
})

const route = useRoute()
const { post, pending } = useBlogPost(route.params.slug as string)

useHead(() => ({
  title: post.value?.title ?? 'DepositDirect',
  meta: [
    {
      id: 'description',
      property: 'description',
      content: post.value?.description,
    },
    { id: 'og:title', property: 'og:title', content: post.value?.title },
    {
      id: 'og:description',
      property: 'og:description',
      content: post.value?.description,
    },
    {
      id: 'twitter:title',
      name: 'twitter:title',
      content: post.value?.title,
    },
    {
      id: 'twitter:description',
      name: 'twitter:description',
      content: post.value?.description,
    },
  ],
}))!
</script>

<template>
  <div class="mx-auto max-w-6xl">
    <div class="mb-6 mt-16 font-semibold underline-offset-2 hover:underline">
      <NuxtLink :to="localePath({ name: 'blog' })"
        ><Icon
          :icon="faPersonWalkingArrowLoopLeft"
          class="text-lg text-gray-950"
        />
        {{ blogT('backToBlogs') }}</NuxtLink
      >
    </div>
    <div class="grid gap-8 md:grid-cols-6">
      <div class="md:col-span-4">
        <div v-if="post" class="flex flex-col gap-4">
          <div class="relative -mx-2 sm:mx-0">
            <div>
              <NuxtImg
                :src="post.image[0]"
                :alt="post.image[1]"
                class="h-full w-full rounded-lg object-cover"
                format="webp"
              />
            </div>
          </div>

          <h1 class="text-4xl" v-text="post.title" />

          <div
            class="prose md:prose-lg prose-img:rounded-xl prose-img:max-h-48 md:prose-img:max-h-96 prose-img:w-full prose-img:object-cover prose-lead:text-base md:prose-lead:text-lg prose-img:border prose-img:border-secondary-400 max-w-none"
          >
            <p class="lead pb-6 md:pb-8" v-text="post.description" />

            <ContentDoc
              v-if="!pending"
              :key="`${post.path}`"
              :path="post.path"
            />
          </div>
        </div>
      </div>

      <div
        class="border-t-2 border-gray-200 pt-6 md:col-span-2 md:border-t-0 md:pt-0"
      >
        <div class="sticky top-6">
          <RelatedArticles v-if="post" :post="post" />
        </div>
      </div>
    </div>
    <div class="my-16 font-semibold md:my-6">
      <NuxtLink :to="localePath({ name: 'blog' })"
        ><Icon
          :icon="faPersonWalkingArrowLoopLeft"
          class="text-lg text-gray-950"
        />
        {{ blogT('backToBlogs') }}</NuxtLink
      >
    </div>
  </div>
</template>
