import type { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

declare module 'vue' {
  export interface GlobalComponents {
    Icon: typeof FontAwesomeIcon
  }
}
