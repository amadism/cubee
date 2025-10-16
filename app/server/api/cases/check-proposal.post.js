import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { caseId, partnerId } = body

    const supabase = await serverSupabaseClient(event)

    const { data, error } = await supabase.rpc('get_proposal_data', {
        _case_id: caseId,
        _partner_id: partnerId
    })

    if (error) {
        throw createError({ statusCode: 400, statusMessage: error.message })
    }

    return data
})