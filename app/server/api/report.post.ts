import { defineEventHandler, readBody } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

type UploadedJsonFile = {
  name: string
  type?: string
  data: string 
}

type ReportBody = {
  step1?: { location?: { lat?: number; lng?: number; name?: string } }
  step2?: { reportType?: string; vehicleMakeModel?: string; mileage?: string; previousDamage?: string }
  step3?: { detailedInformation?: string; uploadedFiles?: UploadedJsonFile[] }
  step4?: { fullName?: string; email?: string; mobile?: string; onWhatsapp?: boolean; lat?: number; lon?: number; locationName?: string }
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

  const tel = String(body?.step4?.mobile)
  const digitsOnly = tel.replace(/\D/g, '')
  let national = digitsOnly
  if (national.startsWith('49')) national = national.slice(2)
  if (national.startsWith('0')) national = national.slice(1)
  const mobile = '+49' + national
  if (!mobile) return { success: false, message: 'Mobile number is required.' }

  const isValidGermanMobile = (mobile: string): boolean => {
    const digits = mobile.replace(/\D/g, '')
    let normalized = digits
    if (normalized.startsWith('49')) normalized = normalized.slice(2)
    if (normalized.startsWith('0')) normalized = normalized.slice(1)
    return /^(?:1(?:5|6|7)\d{8,9})$/.test(normalized)
  }

  if (!isValidGermanMobile(mobile)) {
    return { success: false, message: 'Please enter a valid German mobile number.' }
  }

  if (body?.step4?.onWhatsapp === null) {
    return { success: false, message: 'WhatsApp availability is required.' }
  }

  const email = body?.step4?.email?.trim()
  const folder = email ? email.toLowerCase() : `mobile-${mobile.replace(/\D/g, '')}`
  const uploadedFileUrls: string[] = []

  const jsonFiles: UploadedJsonFile[] = body?.step3?.uploadedFiles || []
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
  

  const payload = {
    report_type: body?.step2?.reportType ?? null,
    vehicle_make_model: body?.step2?.vehicleMakeModel ?? null,
    mileage: body?.step2?.mileage ?? null,
    previous_damage: body?.step2?.previousDamage ?? null,
    detailed_information: body?.step3?.detailedInformation ?? null,
    attachments: uploadedFileUrls.length > 0 ? uploadedFileUrls : null,
    full_name: body?.step4?.fullName ?? null,
    email: body?.step4?.email ?? null,
    tel: mobile,
    on_whatsapp: body?.step4?.onWhatsapp ?? false,
    lat: typeof body?.step4?.lat === 'number' ? body.step4.lat : null,
    lon: typeof body?.step4?.lon === 'number' ? body.step4.lon : null,
    location_name: body?.step4?.locationName ?? null,
    claim_code: generateClaimCode(),
  }

  const { error: insertError } = await supabase.from('cases').insert(payload as any)
  if (insertError) return { success: false, message: `Failed to insert case: ${insertError.message}` }

  
  // if(body?.step4?.onWhatsapp) {
  // await $fetch("/api/send-whatsapp", {
  //       method: "POST",
  //       body: {
  //         templateId: 'tn_9JsXUf8OVOrksaAX1Uqoo',
  //         to: mobile,
  //         variables: [
  //           { position: 1, value: body.step4.fullName }
  //           ],
  //       },
  //     });
  // }
  return { success: true }
})


