import { serverSupabaseClient } from '#supabase/server'
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const supabase = await serverSupabaseClient(event)
  
  const { data, error } = await supabase.rpc('submit_partner_request', {
    _name: body.name,
    _email: body.email,
    _tel: body.tel,
    _lon: body.lon,
    _lat: body.lat,
    _location_name: body.locationName
  })

  if (error) {
    return { success: false, error: error.message }
  }

  // Send confirmation email to user
  if (body.email) {
    try {
      const emailResponse = await $fetch('/api/sendEmail', {
        method: 'POST',
        body: {
          to: body.email,
          subject: 'Partner-Anfrage erhalten - Cubee',
          message: `Sehr geehrte/r ${body.name},

Vielen Dank für Ihre Partner-Anfrage.
Wir werden Ihre Anfrage prüfen und uns so schnell wie möglich bei Ihnen melden.

Mit freundlichen Grüßen,
Ihr Cubee Team`,
        },
      })
      if (emailResponse && emailResponse.error) {
        console.error('Failed to send confirmation email:', emailResponse.error)
      }
    } catch (e) {
      console.error('Failed to send confirmation email:', e)
    }
  }

  // Send notification email to admins
  const adminEmails = ['becker@cubee.expert', 'saad@modernice.design']
  const adminMessage = `Es wurde eine neue Partner-Anfrage eingereicht.

Name: ${body.name || 'Nicht angegeben'}
E-Mail: ${body.email || 'Nicht angegeben'}
Telefon: ${body.tel || 'Nicht angegeben'}
Standort: ${body.locationName || 'Nicht angegeben'}
Koordinaten: ${body.lat || 'N/A'}, ${body.lon || 'N/A'}

Bitte prüfen Sie die Partner-Anfrage zeitnah im System.`

  for (const adminEmail of adminEmails) {
    try {
      const emailResponse = await $fetch('/api/sendEmail', {
        method: 'POST',
        body: {
          to: adminEmail,
          subject: 'Neue Partner-Anfrage eingereicht',
          message: adminMessage,
        },
      })
      if (emailResponse && emailResponse.error) {
        console.error(`Failed to send email to ${adminEmail}:`, emailResponse.error)
      }
    } catch (e) {
      console.error(`Failed to send email to ${adminEmail}:`, e)
    }
  }

  return data || { success: true }
})