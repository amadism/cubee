import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import pkg from './package.json'

const dependencies = Object.keys((pkg as any).dependencies ?? {})
const peerDependencies = Object.keys((pkg as any).peerDependencies ?? {})

export default defineConfig({
  plugins: [dts()],

  build: {
    lib: {
      entry: ['./src/index.ts'],
      formats: ['es'],
      fileName: () => 'index.mjs',
    },
    minify: 'terser',

    rollupOptions: {
      external: (dep) =>
        dep.startsWith('@vue/') ||
        dependencies.includes(dep) ||
        peerDependencies.includes(dep),
    },
  },
})
