import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import pkg from './package.json'
import wsPkg from '../../../package.json'

export default defineConfig({
  plugins: [dts()],

  build: {
    lib: {
      entry: './src/index.ts',
      fileName: (_, name) => `${name}.mjs`,
      formats: ['es'],
    },

    rollupOptions: {
      // input: {
      //   index: './src/index.ts',
      //   nuxt: './src/nuxt/index.ts',
      // },

      external: [
        '#app',

        ...Object.keys(pkg.dependencies),
        ...Object.keys(pkg.peerDependencies),
        ...Object.keys(wsPkg.dependencies),
      ],
    },
  },
})
