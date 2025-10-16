import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const supabase = await serverSupabaseClient(event)

  const { data, error } = await supabase.rpc('get_invoice_data', { 
    _id: body.id,
    _partner_id: body.partnerId
   })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  if (!data || data.length === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'No invoice data found'
    })
  }

  const invoiceData = data[0]

  return invoiceData

})