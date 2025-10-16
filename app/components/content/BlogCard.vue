<script setup lang="ts">
import type { BlogPost } from '@/blog/post'
import type { ComponentPublicInstance } from 'vue'
import { faBookOpen } from '@fortawesome/pro-solid-svg-icons'
import { useElementHover } from '@vueuse/core'

const { post } = defineProps<{ post: BlogPost }>()

const { t: blogT } = useMessages('blog')

const postRoute = computed(() => makeBlogPostRoute(post.localizedSlug))

const linkRef = ref(null as ComponentPublicInstance | null)
const descriptionVisible = ref(false)

onMounted(() => {
  const hovered = useElementHover(() => linkRef.value?.$el)
  watch(hovered, (h) => (descriptionVisible.value = h), { immediate: true })
})
</script>

<template>
  <div>
    <NuxtLink
      ref="linkRef"
      :to="postRoute"
      class="no-deco group relative block cursor-pointer"
    >
      <NuxtImg
        :src="post.image[0]"
        :alt="post.image[1]"
        class="aspect-video w-full rounded-xl border object-cover"
        sizes="sm:640px md:960px"
        placeholder
        format="webp"
        loading="lazy"
      />
      <div class="flex flex-col gap-2 py-2">
        <h2 class="line-clamp-2 text-lg font-semibold" v-text="post.title" />
        <p
          v-text="
            post.description.length > 100
              ? `${post.description.slice(0, 100)}...`
              : post.description
          "
        />
        <div class="mt-3 font-semibold">
          <Button variant="primary">
            <Icon :icon="faBookOpen" class="mr-3 text-gray-950" />
            {{ blogT('readMore') }}
          </Button>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>
