import { defineViteConfig } from '../../config/vite.js'

export default defineViteConfig(import.meta.url, {
  entries: ['index', 'schemas'],
})
