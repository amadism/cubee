declare global {
  interface Window {
    Cal: (...args: any[]) => any
  }
}

export function useCal() {
  onMounted(installCal)

  return {}
}

const calendarInstalled = ref(false)

function installCal() {
  if (calendarInstalled.value) {
    return
  }

  ;(function (C: any, A: any, L: any) {
    const p = function (a: any, ar: any) {
      a.q.push(ar)
    }
    const d = C.document
    C.Cal =
      C.Cal ||
      function () {
        const cal = C.Cal
        // eslint-disable-next-line prefer-rest-params
        const ar = arguments
        if (!cal.loaded) {
          cal.ns = {}
          cal.q = cal.q || []
          d.head.appendChild(d.createElement('script')).src = A
          cal.loaded = true
        }
        if (ar[0] === L) {
          const api = function () {
            // eslint-disable-next-line prefer-rest-params
            p(api, arguments)
          }
          const namespace = ar[1]
          // @ts-expect-error xxx
          api.q = api.q || []
          typeof namespace === 'string'
            ? (cal.ns[namespace] = api) && p(api, ar)
            : p(cal, ar)
          return
        }
        p(cal, ar)
      }
  })(window, 'https://app.cal.com/embed/embed.js', 'init')

  window.Cal('init', { origin: 'https://app.cal.com' })
  window.Cal('ui', {
    styles: { branding: { brandColor: '#fec700' } },
    hideEventTypeDetails: false,
    layout: 'week_view',
  })

  calendarInstalled.value = true
}
