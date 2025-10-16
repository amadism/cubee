import type { ParsedContent } from '@nuxt/content/dist/runtime/types'
import { fetchBlogPost, parseBlogPost } from '~/blog/post'
import { useAsync } from '~/composables/useAsync'

/**
 * Generates a localized blog post route based on the given slug. The resulting
 * route object can be used with Nuxt's `<nuxt-link>` or `router.push()` for
 * navigation.
 */
export function makeBlogPostRoute(slug: string) {
  const localeRoute = useLocaleRoute()
  return localeRoute({
    name: 'blog-slug',
    params: { slug },
  })
}

/**
 * Fetches and returns a blog post with the given slug, along with its
 * corresponding route. If the post is not available in the current locale, it
 * falls back to English. The returned object contains two properties: `post`,
 * which holds the blog post data, and `blogPostRoute`, which holds the route
 * for the blog post.
 */
export function useBlogPost(slug: string) {
  // const { locale } = useI18n()
  const [post, { pending }] = useAsync(() => fetchBlogPost(slug), undefined, {
    key: `blog.post:${slug}`,
  })

  const blogPostRoute = computed(() =>
    post.value ? makeBlogPostRoute(post.value.slug) : null,
  )

  return {
    post,
    pending,
    blogPostRoute,
  }
}

/**
 * Fetches and returns a list of blog posts, optionally excluding specified
 * slugs and caching the result with a custom key. Supports fetching posts in
 * the current locale with fallback to English if not available.
 */
export function useBlogIndex(options?: { exclude?: string; key?: string }) {
  const key = options?.key ?? 'blog.index'

  const { locale } = useI18n()
  const checkOffset = (offset: number, total: number) => {
    if ([total - 2, total - 1, 1, 2].includes(offset)) {
      return true
    }
    return false
  }

  const [posts] = useAsync(
    async () => {
      const data: ParsedContent[] = await queryContent(`blog`).find()

      let posts = data
        .map((data) => parseBlogPost(data))
        .filter((post) => post.locale === locale.value)
        .reverse()

      if (options?.exclude) {
        const index = posts.findIndex((post) => options?.exclude === post.slug)
        const total = posts.length
        if (total > 0) {
          posts = posts.filter((post, id) =>
            checkOffset((id + total - index) % total, total),
          )
        }
      }

      return posts
    },
    undefined,
    { key },
  )

  return {
    posts,
  }
}

export function useBlogRouting() {
  const route = useRoute()
  const isBlogPost = computed(
    () =>
      route.path.includes('/blog') &&
      !route.path.endsWith('/blog') &&
      !route.path.endsWith('/blog/'),
  )
  return { isBlogPost }
}

export function usePagination(posts: Array<any>|null, itemsPerPage = 9): { paginatedPosts: Array<Array<any>>, maxPages: number } {
  if (!posts) return { paginatedPosts: [[]], maxPages: 1 };
  const numberOfPages = Math.ceil(posts.length / itemsPerPage);
  const paginatedPosts: Array<Array<Object>> = [];

  for (let i = 0; i < numberOfPages; i++) {
    const start = i * itemsPerPage;
    const end = start + itemsPerPage;
    paginatedPosts.push(posts.slice(start, end));
  }

  return {
    paginatedPosts: paginatedPosts,
    maxPages: numberOfPages
  }
}