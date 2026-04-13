
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, company, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Basic email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Sanitize inputs - strip HTML tags
    const sanitize = (str: string) => str.replace(/<[^>]*>/g, '').trim().slice(0, 2000);

    const sanitizedData = {
      name: sanitize(name),
      email: sanitize(email),
      company: sanitize(company || ''),
      subject: sanitize(subject),
      message: sanitize(message),
    };

    // Save to admin CMS messages (Vercel Blob-backed)
    const { createPersistedMessage, getPersistedSettings } = await import('@/lib/admin-blob-store');
    await createPersistedMessage(sanitizedData);

    // Send email notification to the configured contact email
    if (process.env.RESEND_API_KEY) {
      try {
        const settings = await getPersistedSettings();
        const toEmail = settings.contactEmail || 'info@akarorme.com';

        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: 'AKAR ÖRME İletişim <onboarding@resend.dev>',
          to: toEmail,
          subject: `Yeni İletişim Formu: ${sanitizedData.subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1a1a2e; border-bottom: 2px solid #C9A84C; padding-bottom: 10px;">
                Yeni İletişim Formu Mesajı
              </h2>
              <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <tr>
                  <td style="padding: 8px 12px; font-weight: bold; color: #555; width: 120px;">Ad Soyad:</td>
                  <td style="padding: 8px 12px;">${sanitizedData.name}</td>
                </tr>
                <tr style="background: #f9f9f9;">
                  <td style="padding: 8px 12px; font-weight: bold; color: #555;">E-posta:</td>
                  <td style="padding: 8px 12px;"><a href="mailto:${sanitizedData.email}">${sanitizedData.email}</a></td>
                </tr>
                ${sanitizedData.company ? `
                <tr>
                  <td style="padding: 8px 12px; font-weight: bold; color: #555;">Firma:</td>
                  <td style="padding: 8px 12px;">${sanitizedData.company}</td>
                </tr>` : ''}
                <tr style="background: #f9f9f9;">
                  <td style="padding: 8px 12px; font-weight: bold; color: #555;">Konu:</td>
                  <td style="padding: 8px 12px;">${sanitizedData.subject}</td>
                </tr>
              </table>
              <div style="margin-top: 20px; padding: 16px; background: #f5f5f0; border-radius: 8px;">
                <p style="margin: 0; font-weight: bold; color: #555; margin-bottom: 8px;">Mesaj:</p>
                <p style="margin: 0; white-space: pre-wrap; color: #333;">${sanitizedData.message}</p>
              </div>
              <p style="margin-top: 20px; font-size: 12px; color: #999;">
                Bu mesaj akarorme.com iletişim formundan gönderilmiştir.
              </p>
            </div>
          `,
        });
      } catch (emailErr) {
        // Log but don't fail the request if email sending fails
        console.error('Email sending failed:', emailErr);
      }
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
