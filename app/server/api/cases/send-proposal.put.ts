import { serverSupabaseClient } from '#supabase/server'
import { defineEventHandler, readBody, getRequestURL, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { caseId, claimCode, partnerId, partnerTel, partnerName } = body

  if (!caseId || !claimCode || !partnerId || !partnerTel || !partnerName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields'
    })
  }


  if (typeof partnerTel !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'partner tel must be a string'
    })
  }

  const supabase = await serverSupabaseClient(event)

  try {
    const { data: caseData, error: fetchError } = await supabase
      .from('cases')
      .select('invited, assigned_to')
      .eq('id', caseId)
      .eq('claim_code', claimCode)
      .single() as { data: { invited: (string | number)[] | null, assigned_to: number | null } | null, error: any }

    if (fetchError) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to fetch case: ${fetchError.message}`
      })
    }

    if (!caseData) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Case not found'
      })
    }

    if (caseData.assigned_to !== null) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Case is already assigned to a partner'
      })
    }

    const partnerIdString = String(partnerId)
    const currentInvited = (caseData.invited || []).map((id: any) => String(id))

    if (currentInvited.includes(partnerIdString)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Partner has already been invited to this case'
      })
    }

    const updatedInvited = Array.from(new Set([...currentInvited, partnerIdString]))

    const { data: updateData, error: updateError } = await (supabase as any)
      .from('cases')
      .update({ invited: updatedInvited })
      .eq('id', caseId)
      .eq('claim_code', claimCode)
      .is('assigned_to', null)
      .select()
      .single()

    if (updateError) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to update case: ${updateError.message}`
      })
    }

   const telString = String(partnerTel || '')
   try {
    const whatsappResponse = await $fetch("/api/send-whatsapp", {
      method: "POST",
      body: {
        templateId: 'tn_yxL1LXQKBXj7l6Qrvun1h',
        to: telString,
        variables: [
          { position: 1, value: partnerName },
          { position: 2, value: `https://cubee-expert.vercel.app/claim-a-case/${caseId}?id=${partnerId}&code=${claimCode}` },
        ],
      },
    });
    
    if (!whatsappResponse.success) {
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to send whatsapp: ${(whatsappResponse as any).error || 'Unknown WhatsApp error'}`
      })
    }

    return {
      success: true,
      whatsapp: whatsappResponse
    }
   } catch (whatsappError: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to send whatsapp: ${whatsappError.message || 'Unknown error'}`
    })
   }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to send proposal: ${error.message || 'Unknown error'}`
    })
  }
})