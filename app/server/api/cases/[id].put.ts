import { serverSupabaseClient } from '#supabase/server'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const supabase = await serverSupabaseClient(event)

  if (!user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const { id } = getRouterParams(event)
  const body = await readBody(event) as Record<string, any>
  if (Object.keys(body).length !== 1 || !body.hasOwnProperty('status')) {
    throw createError({ statusCode: 400, statusMessage: 'Only status field can be updated' })
  }

  const allowedStatuses = ['pending', 'accepted', 'rejected', 'completed', 'assigned']
  if (!allowedStatuses.includes(body.status)) {
    throw createError({ statusCode: 400, statusMessage: 'Status must be one of: pending, accepted, rejected, completed, assigned' })
  }

  const { data, error } = await supabase.from('cases').update({ status: body.status as string } as never).eq('id', id).select().single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return {
    success: true,
    data,
  }
})