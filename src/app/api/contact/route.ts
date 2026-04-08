
import { NextResponse } from 'next/server';
// Contact form target email: bilgi@akarorme.com

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

    // Save to admin CMS messages (localStorage-based)
    const { createMessage } = await import('@/lib/admin-store');
    createMessage({
      name: sanitize(name),
      email: sanitize(email),
      company: sanitize(company || ''),
      subject: sanitize(subject),
      message: sanitize(message),
    });

    // TODO: When connecting a real email service (e.g. Nodemailer, Resend, SendGrid),
    // send the form data to bilgi@akarorme.com

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
