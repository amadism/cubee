import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { case_id, partner_id, code, caseData } = body

  const client = await serverSupabaseClient(event)

  const { data, error } = await client.rpc('claim_case', {
    _case_id: case_id,
    _partner_id: partner_id,
    _code: code,
  })

  if (error) {
    throw createError({ statusCode: 400, statusMessage: error.message })
  }

if(data.success){
  await $fetch("/api/send-whatsapp", {
      method: "POST",
      body: {
        templateId: 'tn_0Y8CDPQaPPZ583cwKMsA7',
        to: caseData.tel,
        variables: [
          { position: 1, value: caseData.partner_name },
          { position: 2, value: caseData.report_type  },
          { position: 3, value: caseData.vehicle_make_model },
          { position: 4, value: caseData.location_name },
          { position: 5, value: caseData.tel  },
          { position: 6, value: caseData.detailed_information },
        ],
      },
    });

   if(caseData?.case_on_whatsapp) {
    await $fetch("/api/send-whatsapp", {
      method: "POST",
      body: {
        templateId: 'tn_cNOSsE5gtxI29tuXOpYRV',
        to: caseData.case_tel,
        variables: [
          { position: 1, value: caseData.case_name }
        ],
      },
    });
   }

   await $fetch("/api/send-whatsapp", {
    method: "POST",
    body: {
      templateId: 'tn_KDujYUuW8oiJHhG3G6nRI',
      to: caseData.partner_tel,
      variables: [
        { position: 1, value: case_id },
        { position: 2, value: `Name: ${caseData.case_name} - Tel: ${caseData.case_tel} - Email: ${caseData.case_email} - Vehicle Make Model: ${caseData.vehicle_make_model} - Location: ${caseData.location_name} - Zuordnung: ${caseData.zuordnung} - Mileage: ${caseData.mileage} - Previous Damage: ${caseData.previous_damage} - Manuf Year: ${caseData.manuf_year} - Detailed Information: ${caseData.detailed_information}` }, 
      ],
    },
  });

  if (caseData?.case_email) {
    try {
      const emailResponse = await $fetch('/api/sendEmail', {
        method: 'POST',
        body: {
          to: [`${caseData.case_email}`],
          subject: 'Ihr Fall wurde einem Partner zugewiesen',
          message: `Ihr Fall wurde einem unserer Partner zugewiesen.\nSie werden in Kürze kontaktiert.`,
        },
      })
      if (emailResponse && emailResponse.error) {
        console.error(`Failed to send email to ${caseData.email}:`, emailResponse.error)
      }
    } catch (e) {
      console.error(`Failed to send email to ${caseData.email}:`, e)
    }
  }

  const adminEmails = ['becker@cubee.expert', 'saad@modernice.design']
  const adminMessage = `Der Fall wurde erfolgreich übernommen.

Fall-ID: ${case_id || 'Nicht angegeben'}
Partner: ${caseData?.partner_name || 'Nicht angegeben'}
Schadensart: ${caseData?.report_type || 'Nicht angegeben'}
Fahrzeug: ${caseData?.vehicle_make_model || 'Nicht angegeben'}
Standort: ${caseData?.location_name || 'Nicht angegeben'}
Case Telefon: ${caseData?.case_tel || 'Nicht angegeben'},
Assistant Telefon: ${caseData?.partner_tel || 'Nicht angegeben'},
Assistant Name: ${caseData?.partner_name || 'Nicht angegeben'},

Weitere Details:
${caseData?.detailed_information || 'Keine zusätzlichen Informationen'}

Der Partner wurde über WhatsApp benachrichtigt.`

  for (const adminEmail of adminEmails) {
    try {
      const emailResponse = await $fetch('/api/sendEmail', {
        method: 'POST',
        body: {
          to: adminEmail,
          subject: 'Fall erfolgreich übernommen',
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
}
  return { success: data.success }
})
