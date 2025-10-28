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

  // Send confirmation email to user
  if (body.email) {
    try {
      const emailResponse = await $fetch('/api/sendEmail', {
        method: 'POST',
        body: {
          to: body.email,
          subject: 'Anfrage erhalten - Cubee',
          message: `Sehr geehrte/r ${body.name},

Vielen Dank für Ihre Anfrage.
Wir werden uns so schnell wie möglich bei Ihnen melden.

Mit freundlichen Grüßen,
Ihr Cubee Support-Team`,
        },
      })
      if (emailResponse && (emailResponse as any).error) {
        console.error('Failed to send confirmation email:', (emailResponse as any).error)
      }
    } catch (e: any) {
      console.error('Failed to send confirmation email:', e)
    }
  }

  // Send notification email to admins
  const adminEmails = ['becker@cubee.expert', 'saad@modernice.design']
  const adminMessage = `Es wurde eine neue Anfrage eingereicht.

Name: ${body.name || 'Nicht angegeben'}
E-Mail: ${body.email || 'Nicht angegeben'}

Nachricht:
${body.message || 'Keine Nachricht'}

Bitte prüfen Sie die Anfrage zeitnah im System.`

  for (const adminEmail of adminEmails) {
    try {
      const emailResponse = await $fetch('/api/sendEmail', {
        method: 'POST',
        body: {
          to: adminEmail,
          subject: 'Neue Anfrage eingereicht',
          message: adminMessage,
        },
      })
      if (emailResponse && (emailResponse as any).error) {
        console.error(`Failed to send email to ${adminEmail}:`, (emailResponse as any).error)
      }
    } catch (e: any) {
      console.error(`Failed to send email to ${adminEmail}:`, e)
    }
  }

  return { success: true }
})