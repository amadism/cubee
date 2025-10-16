import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { id, partnerId, amount, partnerName, tel } = body
  if (!id || !partnerId || !amount || !partnerName || !tel) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing required fields'
    })
  }
  const supabase = await serverSupabaseClient(event)

  const { data, error } = await supabase
    .from('invoices')
    .insert([
      {
        id: id,
        partner_id: partnerId,
        amount: amount
      }
    ])
    .select()
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }
  await $fetch("/api/send-whatsapp", {
      method: "POST",
      body: {
        templateId: 'tn_QV5jOIiuMp5SMMtWdWvLk',
        to: tel,
        variables: [
          { position: 1, value: partnerName },
          { position: 2, value: `https://cubee-expert.vercel.app/invoice/${id}?id=${partnerId}` }
        ],
      },
    });

  return data
})