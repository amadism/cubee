import { serverSupabaseClient } from '#supabase/server'
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const supabase = await serverSupabaseClient(event)
  
  const { data } = await supabase.rpc('submit_partner_request', {
    _name: body.name,
    _email: body.email,
    _tel: body.tel,
    _lon: body.lon,
    _lat: body.lat,
    _location_name: body.locationName
  })
  return data
})