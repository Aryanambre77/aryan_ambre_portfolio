import nodemailer from 'nodemailer';

// Vercel / Serverless function to send email. Configure these environment variables in your deployment:
// SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, FROM_EMAIL (optional), TO_EMAIL (defaults to aryanambre77@gmail.com)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { name, email, message } = req.body || {};
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Missing fields' });
      return;
    }

   
    const host = process.env.SMTP_HOST;
    const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !port || !user || !pass) {
      console.error('SMTP configuration missing');
      res.status(500).json({ error: 'SMTP configuration missing on server' });
      return;
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, 
      auth: {
        user,
        pass,
      },
    });

    const from = process.env.FROM_EMAIL || user;
    const to = process.env.TO_EMAIL || 'aryanambre77@gmail.com';

    const subject = `Portfolio contact from ${name}`;
    const text = `Name: ${name}\nEmail: ${email}\n\n${message}`;

    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><hr/><p>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>`,
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('send-email error', err);
    res.status(500).json({ error: 'Failed to send email' });
  }
}

function escapeHtml(unsafe) {
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
