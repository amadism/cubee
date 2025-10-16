import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const { templateId, to, variables } = body

    const response = await fetch('https://api.superchat.com/v1.0/messages', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'X-API-KEY': process.env.SUPERCHAT_API_KEY || ''
      },
      body: JSON.stringify({
        to: [{ identifier: to }],
        from: { channel_id: 'mc_whANedEgxzGq6uM0fDJrU' },
        content: {
          type: 'whats_app_template',
          template_id: templateId,
          variables: variables
        }
      })
    })

    const result = await response.json()
    return result.status === 'sent' ? {success: true} : {success: false}
  } catch (error: any) {
    return { success: false, error: error.message }
  }
})
