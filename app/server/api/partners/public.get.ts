import { serverSupabaseClient } from '#supabase/server'

export default defineCachedEventHandler(async (event) => {
  const supabase = await serverSupabaseClient(event)

  // Try RPC function first, fallback to direct query
  let data, error

  try {
    const result = await supabase.rpc('get_public_partners')
    data = result.data
    error = result.error
  } catch (rpcError) {
    // Fallback to direct query if RPC function doesn't exist
    const result = await supabase
      .from('partners')
      .select('id, lat, lon')
    data = result.data
    error = result.error
  }

  if (error) {
    console.error('Partners API Error:', error)
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data || []
}, {
  maxAge: 60 * 3,
  getKey: () => 'partners:public'
})
