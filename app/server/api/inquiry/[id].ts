import { serverSupabaseClient } from '#supabase/server'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const { id } = getRouterParams(event)
  const { data, error } = await supabase.from('inquiries').delete().eq('id', id)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true }
})