import { serverSupabaseClient } from '#supabase/server'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const supabase = await serverSupabaseClient(event)

  if (!user || user.app_metadata.role !== 'admin') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

 const body = await readBody(event)

 const newRow = {
    name: body.name,
    email: body.email || null,
    tel: body.tel,
    zip: body.zip || null,
    lon: body.lon,
    lat: body.lat,
    location_name: body.location_name
 }

  const { data, error } = await supabase.from('partners').insert(newRow as never)

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data
})