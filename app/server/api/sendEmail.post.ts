import { Resend } from 'resend';
import { readBody } from 'h3';

if (!process.env.RESEND_API_KEY) {
  console.error('RESEND_API_KEY is not configured in environment variables');
}

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function nl2br(text: string): string {
  return text.replace(/\n/g, '<br>');
}

function createEmailTemplate(message: string): string {
  const escapedMessage = escapeHtml(message);
  const formattedMessage = nl2br(escapedMessage);
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #F7FAFE;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #F7FAFE;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(7, 13, 21, 0.08);">
          <tr>
            <td style="background: linear-gradient(135deg, #F7FAFE 0%, #ffffff 100%); border-bottom: 3px solid #FEC907; border-radius: 8px 8px 0 0;">
              <img src="https://xqibadvjbgdhacuwipkw.supabase.co/storage/v1/object/public/case-images/cubee.png" alt="Cubee" style="display: inline-block;" />
            </td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <div style="color: #070D15; font-size: 16px; line-height: 1.7; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">${formattedMessage}</div>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 40px; background-color: #F7FAFE; border-top: 1px solid #E4E8EA; border-radius: 0 0 8px 8px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td style="text-align: center; padding-bottom: 12px;">
                    <p style="margin: 0; font-size: 13px; color: #697174; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">© ${new Date().getFullYear()} Cubee. All rights reserved.</p>
                  </td>
                </tr>
                <tr>
                  <td style="text-align: center;">
                    <a href="https://cubee.expert" style="display: inline-block; padding: 10px 24px; background-color: #FEC907; color: #070D15; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">Visit Cubee</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is missing');
      return { data: null, error: { message: 'Email service is not configured. RESEND_API_KEY is missing.' } };
    }

    // Validate required fields
    if (!body.to) {
      return { error: { message: 'Missing required field: to' } };
    }
    if (!body.subject) {
      return { error: { message: 'Missing required field: subject' } };
    }

    const htmlContent = body.html ? body.html : createEmailTemplate(body.message || '');

    const recipients = Array.isArray(body.to) ? body.to : [body.to];

    const { data, error } = await resend.emails.send({
      from: 'Cubee <support@cubee.expert>',
      to: recipients,
      subject: body.subject,
      html: htmlContent,
    });

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error: any) {
    return { 
      data: null, 
      error: { 
        name: error.name || 'unknown_error', 
        message: error.message || 'An unexpected error occurred' 
      } 
    };
  }
});