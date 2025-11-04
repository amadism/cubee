export function usePartnerBooking() {
  const DEFAULT_URL = 'https://app.acuityscheduling.com/schedule.php?owner=33374738'

  const partnerToCalendar: Record<string, string> = {
    // '123': 'https://app.acuityscheduling.com/schedule.php?owner=33374738&calendarID=XXXXX',
  }

  function getPartnerCalendarUrl(partnerId: string | number | undefined) {
    if (!partnerId) return DEFAULT_URL
    const key = String(partnerId)
    return partnerToCalendar[key] || DEFAULT_URL
  }

  return { getPartnerCalendarUrl }
}


