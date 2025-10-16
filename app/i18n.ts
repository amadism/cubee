import type { About } from './i18n/about'
import type { Appointment } from './i18n/appointment'
import type { Blog } from './i18n/blog'
import type { Contact } from './i18n/contact'
import type { Finder } from './i18n/finder'
import type { Global } from './i18n/global'
import type { Home } from './i18n/home'
import type { Insurance } from './i18n/insurance'
import type { Scheduler } from './i18n/scheduler'
import type { CaseSubmit } from './i18n/case-submit'

declare module '@modernice/vue-i18n-modules' {
  export interface DefineModules {
    global: Global
    home: Home
    insurance: Insurance
    about: About
    contact: Contact
    finder: Finder
    blog: Blog
    appointment: Appointment
    scheduler: Scheduler
    'case-submit': CaseSubmit
  }
}

export {}
