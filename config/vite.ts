import { createRequire } from 'node:module'
import {
  type BuildOptions,
  type LibraryOptions,
  type UserConfig,
  defineConfig,
} from 'vite'
import dts from 'vite-plugin-dts'
import pkg from '../package.json'

/**
 * Defines a Vite configuration object with options for building and bundling a
 * library. The configuration object is created asynchronously using the path to
 * the actual `vite.config` file and an optional `options` object containing
 * settings for entries, declaration, formats, minify, and external
 * dependencies. The function returns a `UserConfig` object that can be used to
 * configure Vite.
 */
export function defineViteConfig(
  /**
   * The path to the actual vite.config file. This is usually `import.meta.url`.
   */
  path: string,
  options?: {
    /**
     * @default { index: './src/index.ts' }
     */
    entries?: Record<string, string> | string[] | string

    /**
     * @default true
     */
    declaration?: boolean

    /**
     * @default ['es']
     */
    formats?: LibraryOptions['formats']

    /**
     * @default 'terser'
     */
    minify?: BuildOptions['minify']

    /**
     * Additional external dependencies.
     */
    external?: string[]
  },
) {
  const pkgPath = new URL('package.json', path).pathname

  const entries = parseEntries(options?.entries ?? { index: './src/index.ts' })
  const declaration = options?.declaration ?? true
  const formats = options?.formats ?? ['es']
  const minify = options?.minify ?? 'terser'
  const external = options?.external ?? []

  const plugins = [] as UserConfig['plugins'] & {}

  if (declaration) {
    plugins.push(dts())
  }

  return defineConfig(async () => {
    const require = createRequire(import.meta.url)
    const pkg = require(pkgPath) as PackageJSON
    const peers = [
      ...Object.keys(pkg.dependencies ?? {}),
      ...Object.keys(pkg.peerDependencies ?? {}),
      ...external,
    ]

    return {
      plugins,

      build: {
        minify,

        lib: {
          entry: './src/index.ts',
          fileName: (format, name) =>
            `${name}.${format === 'es' ? 'mjs' : format}`,
          formats,
        },

        rollupOptions: {
          input: entries,
          external: (dep) => isExternal(dep, { peers }),
        },
      },
    }
  })
}

/**
 * Returns whether a dependency should be considered external by bundlers.
 * All dependencies and peer dependencies of the workspace package are considered external.
 * You can also pass an array of peer dependencies that should be considered external.
 *
 * Additionally, all `@deposit/*` and `@vue/*` dependencies are considered external.
 */
export function isExternal(
  dep: string,
  options?: {
    peers?: string[]
  },
) {
  const peers = [
    ...Object.keys((pkg as any).dependencies ?? {}),
    ...Object.keys((pkg as any).peerDependencies ?? {}),
    ...(options?.peers ?? []),
  ].filter((dep) => !!dep)

  return (
    dep.startsWith('@cubee/') || dep.startsWith('@vue/') || peers.includes(dep)
  )
}

interface PackageJSON {
  dependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}

function parseEntries(input: Record<string, string> | string[] | string) {
  if (typeof input === 'string') {
    return { [input]: `./src/${input}.ts` }
  }

  if (Array.isArray(input)) {
    return input.reduce((acc, name) => {
      return { ...acc, [name]: `./src/${name}.ts` }
    }, {})
  }

  return input
}
