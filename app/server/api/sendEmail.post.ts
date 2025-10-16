import nodemailer from 'nodemailer'
import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event) // { to, subject, message }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  })

  await transporter.sendMail({
    from: `"Cubee" <${process.env.MAIL_USER}>`,
    to: body.to,
    subject: body.subject,
    text: body.message,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Cubee</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #fef3c7 0%, #fbbf24 100%); min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background: white; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <div style="background: linear-gradient(to right, #fef3c7, #fbbf24); height: 4px; border-radius: 2px; margin-bottom: 30px;"></div>
            
            <div style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              ${body.message.replace(/\n/g, '<br>')}
            </div>
            
            <div style="background: linear-gradient(to right, #fef3c7, #fbbf24); height: 2px; border-radius: 1px; margin: 30px 0;"></div>
          </div>
          
          <!-- Footer -->
          <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
              This email was sent by <strong style="color: #facc15;">Cubee</strong><br>
              Thank you for choosing our services! 🐝
            </p>
            <div style="margin-top: 20px;">
              <div style="display: inline-block; width: 30px; height: 30px; background: linear-gradient(135deg, #facc15, #eab308); border-radius: 50%; margin: 0 5px; position: relative;">
                <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 16px;">🐝</span>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  })

  return { success: true }
})


