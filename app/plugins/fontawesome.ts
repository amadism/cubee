import { config } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

config.autoAddCss = false

export default defineNuxtPlugin(({ vueApp }) => {
  vueApp.component('Icon', FontAwesomeIcon)
})
