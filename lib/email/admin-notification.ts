import nodemailer from "nodemailer";

type SmtpConfig = { host: string; port: number; user: string; pass: string; from: string };

function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = (process.env.SMTP_PASSWORD ?? process.env.SMTP_PASS)?.trim();
  if (!host || !user || !pass) return null;
  const port = Number(process.env.SMTP_PORT || 465);
  const from = process.env.SMTP_FROM?.trim() || user;
  return { host, port, user, pass, from };
}

async function sendViaSmtp(cfg: SmtpConfig, to: string, subject: string, html: string): Promise<void> {
  const secure = cfg.port === 465;
  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure,
    auth: { user: cfg.user, pass: cfg.pass },
    ...(!secure ? { requireTLS: true } : {}),
  });

  await transporter.sendMail({
    from: cfg.from,
    to,
    subject,
    html,
  });
}

async function sendViaResend(to: string, subject: string, html: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const from = process.env.RESEND_FROM_EMAIL || "EstabWeb <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend ${res.status}: ${text}`);
  }
}

export async function sendNewUserAdminNotification(userEmail: string): Promise<void> {
  const to = "danravekeh123@gmail.com";
  const subject = `New User Registration: ${userEmail}`;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <tr>
            <td height="4" style="background-color: #10b981;"></td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">New User Registration</h1>
              <p style="margin: 0 0 32px 0; font-size: 15px; color: #64748b; line-height: 1.5;">A new user has just registered on EstabWeb.</p>
              
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px; font-weight: 600; width: 100px; vertical-align: top;">Email</td>
                  <td style="padding: 12px 0 12px 20px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 14px; font-weight: 500; vertical-align: top;">${userEmail}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const smtp = getSmtpConfig();
  if (smtp) {
    await sendViaSmtp(smtp, to, subject, html);
    return;
  }

  if (process.env.RESEND_API_KEY) {
    await sendViaResend(to, subject, html);
  } else {
    console.warn("No email configuration found. Could not send admin notification.");
  }
}
