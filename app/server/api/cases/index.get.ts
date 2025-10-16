import { serverSupabaseClient } from '#supabase/server'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const supabase = await serverSupabaseClient(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const query = getQuery(event)
  const page = Number(query.page || 1)
  const pageSize = Math.min(100, Number(query.pageSize || 10))
  const status = String(query.status)
  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let request = supabase
    .from('cases')
    .select('*, partner:partners(name, location_name)')

  if (status) {
    request = request.eq('status', status)
  }

  const { data, error } = await request
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { data: data || [], page, pageSize }
})
