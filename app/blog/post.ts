import type { ParsedContent } from '@nuxt/content/dist/runtime/types'
import slugify from 'slugify'

/**
 * BlogPost represents a structured blog post object containing essential
 * information such as title, slug, description, image, and path. It is used by
 * the {@link fetchBlogPost} and {@link parseBlogPost} functions to retrieve and
 * parse blog post data.
 */
export interface BlogPost {
  /**
   * Represents the main heading of a `BlogPost`. It is utilized as a unique
   * identifier for the blog post when generating and accessing its
   * corresponding slug, and it is also displayed prominently at the top of the
   * blog post page to provide readers with a clear understanding of the post's
   * topic.
   */
  title: string
  /**
   * Represents the URL-friendly, unique identifier for a `BlogPost` instance.
   * Used to fetch and display the blog post using `fetchBlogPost` and
   * `parseBlogPost` functions, ensuring a consistent and SEO-friendly URL
   * structure.
   */
  slug: string
  /**
   * A brief summary of the blog post's content, used to provide an overview for
   * readers when displaying a list of blog posts or as a meta description for
   * SEO purposes. The `description` property is set during the {@link
   * parseBlogPost} function and is derived from the input `data.description`.
   */
  description: string
  /**
   * Represents the image associated with a `BlogPost`. It contains an array
   * with two elements: `url` and `alt`. The `url` is a string containing the
   * image source URL, and the `alt` is a string representing the alternative
   * text for the image. This property is used to visually enhance the blog post
   * and provide context to users with screen readers.
   */
  image: [url: string, alt: string]
  /**
   * Represents the URL path of the blog post, used for navigating to the post
   * and generating links within the application. The `path` is derived from the
   * {@link ParsedContent} object and takes into account the current locale.
   */
  path: string

  /**
   * Represents the localized slug of the blog post, used for generating links
   */
  localizedSlug: string

  /**
   * The `locale` property represents the language and regional settings for a
   * `BlogPost`. It is used to fetch and display blog posts in the appropriate
   * language, ensuring that the content is accessible to readers with different
   * language preferences. The `locale` value is derived from the {@link
   * ParsedContent} object and is utilized by the {@link fetchBlogPost} and
   * {@link parseBlogPost} functions to retrieve and parse blog posts based on
   * the specified locale.
   */
  locale: string
}

export async function fetchBlogPost(slug: string) {
  const post = await queryContent(`blog`).where({ slug }).findOne()
  const parsed = parseBlogPost(post)
  return parsed
}

/**
 * Converts the given `ParsedContent` data into a `BlogPost` object with
 * localized properties based on the provided options.
 */
export function parseBlogPost(data: ParsedContent) {
  const locale = data._id.replace(/.+:(.+?)\.md$/, '$1')
  const pathExtRE = new RegExp(`/${locale}$`)

  return {
    locale,
    title: data.title || '',
    slug: slugify(
      data._path?.replace(`/blog/`, '').replace(pathExtRE, '') ||
      slugify(data.title || ''),
    ),
    description: data.description,
    image: [data.image, data.alt],
    path: data._path || '',
    localizedSlug: data.slug || '',
  } satisfies BlogPost as BlogPost
}

export async function fetchSiblingPosts(slug: string) {
  const main = await fetchBlogPost(slug)

  const siblings = (
    await queryContent(`blog/${main.slug}`)
      .where({ slug: { $ne: slug } })
      .find()
  ).map(parseBlogPost)

  return siblings
}