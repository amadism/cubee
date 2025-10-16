<script setup lang="ts">
import BlogCard from '@/components/content/BlogCard.vue'

const { posts } = useBlogIndex()
const { translate } = useMessages('blog')
const page = ref(1)
const { paginatedPosts, maxPages } = usePagination(posts.value)

definePageMeta({
  middleware: ['i18n:messages'],
  messages: ['blog'],
})

useHead({
  title: translate('$seo.title'),
  meta: [
    {
      id: 'description',
      property: 'description',
      content: translate('$seo.description'),
    },
    { id: 'og:title', property: 'og:title', content: translate('$seo.title') },
    {
      id: 'og:description',
      property: 'og:description',
      content: translate('$seo.description'),
    },
    {
      id: 'twitter:title',
      name: 'twitter:title',
      content: translate('$seo.title'),
    },
    {
      id: 'twitter:description',
      name: 'twitter:description',
      content: translate('$seo.description'),
    },
  ],
})
</script>

<template>
  <div class="mx-auto max-w-6xl px-5 pb-12">
    <div class="flex flex-col md:flex-row">
      <div class="px-12 sm:p-16 md:order-2 md:p-8">
        <nuxt-img
          alt="cubee blog illustration showcasing a reader looking at our blog page"
          src="/img/blog.jpg"
        />
      </div>
      <div class="md:mr-6 md:mt-20 md:w-5/6">
        <h1
          class="mt-4 text-3xl font-semibold md:mt-16 md:text-4xl"
          v-text="translate('$hero.title')"
        />
        <p
          class="mt-3 !leading-relaxed md:mt-4 md:text-lg"
          v-text="translate('$hero.desc')"
        />
      </div>
    </div>
    <hr class="my-12" />
    <div>
      <div class="mb-12 md:w-2/3">
        <h2
          class="mt-4 text-3xl font-semibold md:mt-16 md:text-3xl"
          v-text="translate('$blog.title')"
        />
        <p class="mt-3 !leading-relaxed" v-text="translate('$blog.desc')"></p>
      </div>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div>
          <p class="rounded-lg bg-gray-100 py-24 text-center text-gray-600">
            No articles yet
          </p>
        </div>
        <!-- <BlogCard
          v-for="post of paginatedPosts[page - 1]"
          :key="post.slug"
          :post="post"
        /> -->
      </div>
      <div class="mt-16 flex justify-center md:justify-center">
        <Pagination
          v-if="maxPages > 1"
          v-model:page="page"
          :total="maxPages"
          :sibling-count="1"
          show-edges
          :default-page="1"
        >
          <PaginationList v-slot="{ items }" class="flex items-center gap-1">
            <PaginationFirst />
            <PaginationPrev />

            <template v-for="(item, index) in items">
              <PaginationListItem
                v-if="item.type === 'page'"
                :key="index"
                :value="item.value"
                as-child
              >
                <Button
                  :class="`h-10 w-10 p-0 ${index + 1 === page ? 'border-2 border-yellow-500 bg-yellow-900 text-gray-950' : ''}`"
                  :variant="item.value === page ? 'default' : 'outline'"
                >
                  {{ item.value }}
                </Button>
              </PaginationListItem>
              <PaginationEllipsis v-else :key="item.type" :index="index" />
            </template>

            <PaginationNext />
            <PaginationLast />
          </PaginationList>
        </Pagination>
      </div>
    </div>
  </div>
</template>
