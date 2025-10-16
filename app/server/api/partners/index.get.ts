import { serverSupabaseClient } from '#supabase/server'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const supabase = await serverSupabaseClient(event)

  if (!user || user.app_metadata.role !== 'admin') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const query = getQuery(event)
  const status = (query.status as string)
  
  if(!status) {
    throw createError({ statusCode: 400, statusMessage: 'Status is required' })
  }

  if(status !== 'active' && status !== 'pending') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid status' })
  }

  const { data, error } = await supabase.from('partners').select('*').eq('status', status)
  

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data
})