import { serverSupabaseClient } from '#supabase/server'
import { defineEventHandler, getRouterParams, getQuery, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const params = getRouterParams(event) as any
  const query = getQuery(event) as any
  const body = (await readBody(event)) as any
  const id = params?.id || query?.id || body?.id

  if (!id) {
    return { success: false, error: 'Missing id' }
  }

  const table: any = supabase.from('inquiries' as any)
  const { data, error } = await table.update({ status: 'read' }).eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
})