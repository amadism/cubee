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
}
  return { success: data.success }
})
