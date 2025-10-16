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

  const body = await readBody(event)

  const updateRow: Record<string, unknown> = {}
  const fields = ['name', 'email', 'tel', 'zip', 'lon', 'lat', 'location_name', 'note', 'status']
  for (const key of fields) {
    if (key in body) updateRow[key] = body[key]
  }

  if (Object.keys(updateRow).length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No fields to update' })
  }

  const { data, error } = await supabase
    .from('partners')
    .update(updateRow as never)
    .eq('id', id as never)
    .select('*')
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data
})


