import { defineEventHandler, readBody } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

type UploadedJsonFile = {
  name: string
  type?: string
  data: string 
}

type ReportBody = {
  step1?: { location?: { lat?: number; lng?: number; name?: string } }
  step2?: { reportType?: string; zuordnung?: string }
  step3?: { vehicleMakeModel?: string; mileage?: string; previousDamage?: string; manufYear?: string | number }
  step4?: { detailedInformation?: string; uploadedFiles?: UploadedJsonFile[] }
  step5?: { fullName?: string; email?: string; mobile?: string; onWhatsapp?: boolean; lat?: number; lon?: number; locationName?: string }
}

function dataUrlOrBase64ToBuffer(input: string): { buffer: Buffer; mime?: string } {
  const match = input.match(/^data:(.*?);base64,(.*)$/)
  if (match) {
    const mime = match[1]
    const b64 = match[2]
    return { buffer: Buffer.from(b64, 'base64'), mime }
  }
  return { buffer: Buffer.from(input, 'base64') }
}

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as ReportBody

  const supabase = await serverSupabaseClient(event)

  const mobile = String(body?.step5?.mobile ?? '').trim()
  if (!mobile) return { success: false, message: 'Mobile number is required.' }

  const isValidPhoneNumber = (value: string): boolean => {
    const digits = value.replace(/\D/g, '')
    return digits.length >= 7
  }

  if (!isValidPhoneNumber(mobile)) {
    return { success: false, message: 'Please enter a valid phone number.' }
  }

  if (body?.step5?.onWhatsapp === null) {
    return { success: false, message: 'WhatsApp availability is required.' }
  }

  const email = body?.step5?.email?.trim()
  const folder = email ? email.toLowerCase() : `mobile-${mobile.replace(/\D/g, '')}`
  const uploadedFileUrls: string[] = []

  const jsonFiles: UploadedJsonFile[] = body?.step4?.uploadedFiles || []
  for (const jf of jsonFiles) {
    const { buffer, mime } = dataUrlOrBase64ToBuffer(jf.data)
    const safeName = (jf.name || `file-${Date.now()}`).replace(/\s+/g, '-')
    const objectPath = `${folder}/${Date.now()}-${safeName}`
    const { data, error } = await supabase.storage
      .from('case-images')
      .upload(objectPath, buffer, {
        contentType: jf.type || mime || 'application/octet-stream',
        upsert: true,
      })
    if (error) return { success: false, message: `Failed to upload file: ${error.message}` }
    const { data: publicUrlData } = supabase.storage.from('case-images').getPublicUrl(data.path)
    uploadedFileUrls.push(publicUrlData.publicUrl)
  }

  const generateClaimCode = () => {
    const random = Math.random().toString(36).slice(2, 8)
    return `CUBEE${Date.now().toString(36)}${random}`.toUpperCase()
  }
  

  const manufYearRaw = body?.step3?.manufYear;
  const parsedManufYear =
    typeof manufYearRaw === 'number'
      ? manufYearRaw
      : typeof manufYearRaw === 'string' && manufYearRaw.trim().length > 0
        ? Number(manufYearRaw)
        : null;
  const manufYear =
    parsedManufYear !== null && Number.isInteger(parsedManufYear)
      ? parsedManufYear
      : null;

  const payload = {
    report_type: body?.step2?.reportType ?? null,
    zuordnung: body?.step2?.zuordnung ?? null,
    vehicle_make_model: body?.step3?.vehicleMakeModel ?? null,
    mileage: body?.step3?.mileage ?? null,
    previous_damage: body?.step3?.previousDamage ?? null,
    manuf_year: manufYear,
    detailed_information: body?.step4?.detailedInformation ?? null,
    attachments: uploadedFileUrls.length > 0 ? uploadedFileUrls : null,
    full_name: body?.step5?.fullName ?? null,
    email: body?.step5?.email ?? null,
    tel: mobile,
    on_whatsapp: body?.step5?.onWhatsapp ?? false,
    lat: typeof body?.step5?.lat === 'number' ? body.step5.lat : null,
    lon: typeof body?.step5?.lon === 'number' ? body.step5.lon : null,
    location_name: body?.step5?.locationName ?? null,
    claim_code: generateClaimCode(),
  }

  const { error: insertError } = await supabase.from('cases').insert(payload as any)
  if (insertError) return { success: false, message: `Failed to insert case: ${insertError.message}` }

  
  if(body?.step5?.onWhatsapp) {
  await $fetch("/api/send-whatsapp", {
        method: "POST",
        body: {
          templateId: 'tn_cPRj1wT4p2N7kHB4SOoUG',
          to: mobile,
          variables: [
            { position: 1, value: body.step5.fullName }
            ],
        },
      });
  }

  // Send confirmation email to user
  if (body?.step5?.email) {
    try {
      const emailResponse = await $fetch("/api/sendEmail", {
        method: "POST",
        body: {
          to: body.step5.email,
          subject: "Schadensmeldung erhalten - Cubee",
          message: `Sehr geehrte/r ${body.step5.fullName},

Vielen Dank für Ihre Schadensmeldung.
Unser Team wird Ihre Anfrage prüfen und sich zeitnah bei Ihnen melden.

Mit freundlichen Grüßen,
Ihr Cubee Support-Team`,
        },
      });
      if (emailResponse && (emailResponse as any).error) {
        console.error("Failed to send confirmation email:", (emailResponse as any).error);
      }
    } catch (err) {
      console.error("Failed to send confirmation email:", err);
    }
  }

  const adminEmails = ['becker@cubee.expert', 'saad@modernice.design'];

  
  const adminMessage = `Es wurde eine neue Schadensmeldung eingereicht.

Name: ${body.step5?.fullName || 'Nicht angegeben'}
E-Mail: ${body.step5?.email || 'Nicht angegeben'}
Mobilnummer: ${body.step5?.mobile || 'Nicht angegeben'}
Schadensart: ${body.step2?.reportType || 'Nicht angegeben'}
Fahrzeug: ${body.step3?.vehicleMakeModel || 'Nicht angegeben'}
Kilometerstand: ${body.step3?.mileage || 'Nicht angegeben'}
Baujahr: ${body.step3?.manufYear || 'Nicht angegeben'}
Vorschäden: ${body.step3?.previousDamage || 'Nicht angegeben'}
Standort: ${body.step5?.locationName || 'Nicht angegeben'}

Weitere Details:
${body.step4?.detailedInformation || 'Keine zusätzlichen Informationen'}

Bitte prüfen Sie den Vorgang zeitnah im System.`;

  for (const adminEmail of adminEmails) {
    try {
      const emailResponse = await $fetch("/api/sendEmail", {
        method: "POST",
        body: {
          to: adminEmail,
          subject: 'Neue Schadensmeldung eingereicht',
          message: adminMessage,
        },
      });
      if (emailResponse && (emailResponse as any).error) {
        console.error(`Failed to send email to ${adminEmail}:`, (emailResponse as any).error);
      }
    } catch (err) {
      console.error(`Failed to send email to ${adminEmail}:`, err);
    }
  }

  return { success: true }
})


