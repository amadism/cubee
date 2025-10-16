import { serverSupabaseClient } from '#supabase/server'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)
  const { data, error } = await supabase.from('inquiries').select('*').eq('status', 'pending')

  if (error) {
    return { success: false, error: error.message }
  }

  return data
})