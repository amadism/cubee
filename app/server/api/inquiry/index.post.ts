import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const supabase = await serverSupabaseClient(event)
  
  const { data, error } = await (supabase as any)
    .from('inquiries')
    .insert({
    name: body.name,
    email: body.email,
    message: body.message
    } as any)
    .select()
    .single()


  if (error) {
    return { success: false, error: error.message }
  }

  try {
    await $fetch('/api/sendEmail', {
      method: 'POST',
      body: {
        to: body.email,
        subject: 'Cubee - Inquiry',
        message: `
          Dear ${body.name},
          Thank you for your inquiry. We will get back to you as soon as possible.
        `,
      },
    })
  } catch (e: any) {
    return { success: false, error: e?.message || 'Failed to send email' }
  }

  return { success: true }
})