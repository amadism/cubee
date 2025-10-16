import postcssNesting from 'postcss-nesting'
import svgLoader from 'vite-svg-loader'
// import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { locales } from './config/i18n'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@vueuse/nuxt',
    '@nuxtjs/i18n',
    '@modernice/nuxt-i18n-modules',
    '@pinia/nuxt',
    '@nuxtjs/google-fonts',
    '@nuxt/fonts',
    '@nuxtjs/tailwindcss',
    '@morev/vue-transitions/nuxt',
    'shadcn-nuxt',
    'nuxt-mail',
    '@nuxt/content',
    '@nuxt/image',
    '@nuxtjs/device',
    '@nuxt/scripts',
    '@nuxtjs/seo',
    '@nuxtjs/supabase',
  ],

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false,
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  mail: {
    message: {
      to: 'internal@cubee.expert',
    },
    smtp: {
      host: 'smtps.udag.de',
      port: 587,
      auth: {
        user: 'internal@cubee.expert',
        pass: 'WBU6c9jMt2c4Kty**',
      },
    },
  },

  devtools: { enabled: true },

  runtimeConfig: {
    i18n: {
      baseUrl: '',
    },

    public: {
      googleMaps: {
        apiKey: process.env.NUXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
      mapbox: {
        accessToken: process.env.NUXT_PUBLIC_MAPBOX_ACCESS_TOKEN || 'pk.eyJ1IjoibW9kZXJuaWNlIiwiYSI6ImNseDF3ZmdsdjBkd3cycXM5NXZlYTBxd2IifQ.4TdDROuEq-7vnDBBqjO8cw',
      },

      scripts: {
        registry: {
          googleTagManager: {
            id: process.env.NUXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
          },

          googleAnalytics: {
            id: process.env.NUXT_PUBLIC_GOOGLE_ANALYTICS_ID,
          },
        },
      },
    },
  },

  i18n: {
    defaultLocale: 'de',
    strategy: 'prefix_except_default',
    detectBrowserLanguage: {
      useCookie: true,
      redirectOn: 'root',
    },
    locales: locales.slice(),
  },

  i18nModules: {
    dictionary: './i18n',
    initial: ['home', 'global', 'contact', 'case-submit'],
  },

  googleFonts: {
    families: {
      Poppins: true,
    },
  },

  typescript: {
    shim: false,
    strict: true,

    tsConfig: {
      compilerOptions: {
        types: ['google.maps'],
      },
    },
  },

  css: ['@fortawesome/fontawesome-svg-core/styles.css'],

  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: './tailwind.config.ts',
  },

  vite: {
    css: {
      postcss: {
        plugins: [postcssNesting()],
      },
    },
    server: {
      watch: {
        usePolling: true, // fixes some environments like WSL/Docker
      },
    },
    plugins: [svgLoader()],
    vue: {
      features: {
        propsDestructure: true,
      },
      // template: {
      //   transformAssetUrls,
      // },
    },
  },

  shadcn: {
    prefix: '',
    componentDir: './components/ui',
  },

  seo: {
    meta: {
      title:
        'KFZ-Gutachten und Schadensbewertungen in der Nähe | CUBEE Deutschland',
    },
  },

  sitemap: {
    sitemaps: {
      pages: {
        includeAppSources: true,
      },
      cities: {
        sources: ['/api/__sitemap__/urls/cities'],
      },
    },
  },

  compatibilityDate: '2024-07-03',
})
