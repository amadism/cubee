export type AppointmentMode = 'station' | 'driver'

export function useAppointmentMode() {
  const route = useRoute()
  const mode = computed<AppointmentMode>(
    () => String(route.query.mode || 'station') as AppointmentMode,
  )

  return { mode }
}
