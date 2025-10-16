<script setup lang="ts">
import type { BlogPost } from '@/blog/post'
import BlogCard from '~/components/content/BlogCard.vue'

const { post } = defineProps<{ post: BlogPost }>()

const { translate } = useMessages('blog')

const { posts: _posts } = useBlogIndex({
  exclude: post.slug,
  key: `post:${post.slug}`,
})

const frozen = shallowRef([] as BlogPost[])
const posts = computed(() =>
  frozen.value.length ? frozen.value : _posts.value?.slice() ?? [],
)

watch(_posts, (p) => {
  if (p) {
    frozen.value = p.slice() || []
  }
})

useRouter().afterEach(() => (frozen.value = _posts.value?.slice() || []))
</script>

<template>
  <div>
    <h2
      class="mb-4 text-xl"
      v-text="translate('relatedArticles')"
    />
    <div class="grid gap-4">
        <BlogCard v-for="post of posts" :key="post.slug" :post="post" />
    </div>
  </div>
</template>
