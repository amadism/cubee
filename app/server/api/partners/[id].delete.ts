import { serverSupabaseClient } from '#supabase/server'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const supabase = await serverSupabaseClient(event)

  if (!user || user.app_metadata.role !== 'admin') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const { id } = getRouterParams(event)
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Missing id' })
  }

  const { error } = await supabase
    .from('partners')
    .delete()
    .eq('id', id as never)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { success: true }
})


