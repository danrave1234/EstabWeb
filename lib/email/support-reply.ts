import nodemailer from "nodemailer";

type SupportReplyNotificationInput = {
  to: string;
  subject: string;
  requestSubject?: string | null;
  requestType?: string | null;
  replyMessage: string;
  brandName?: string | null;
};

type SmtpConfig = { host: string; port: number; user: string; pass: string; from: string };

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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

function buildSupportReplyEmail(input: SupportReplyNotificationInput): string {
  const siteName = input.brandName?.trim() || "your EstabWeb project";
  const requestType = input.requestType?.trim();
  const requestSubject = input.requestSubject?.trim();

  return `
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
            <td height="4" style="background-color: #0f172a;"></td>
          </tr>
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px;">Support reply from EstabWeb</h1>
              <p style="margin: 0 0 28px 0; font-size: 15px; color: #64748b; line-height: 1.5;">
                Our team replied to your support request for <strong>${escapeHtml(siteName)}</strong>.
              </p>

              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                ${requestType ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px; font-weight: 600; width: 120px;">Request type</td>
                  <td style="padding: 12px 0 12px 20px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 14px; font-weight: 500;">${escapeHtml(requestType)}</td>
                </tr>` : ""}
                ${requestSubject ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px; font-weight: 600; width: 120px;">Subject</td>
                  <td style="padding: 12px 0 12px 20px; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-size: 14px; font-weight: 500;">${escapeHtml(requestSubject)}</td>
                </tr>` : ""}
              </table>

              <div style="margin-top: 28px; padding: 24px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
                <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.08em;">Reply</p>
                <p style="margin: 0; font-size: 15px; color: #0f172a; line-height: 1.7; white-space: pre-wrap;">${escapeHtml(input.replyMessage)}</p>
              </div>

              <p style="margin: 28px 0 0 0; font-size: 13px; color: #64748b; line-height: 1.6;">
                If you need to add more details, open the support chat in your EstabWeb account and send another message.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

export async function sendSupportReplyNotification(input: SupportReplyNotificationInput): Promise<void> {
  const html = buildSupportReplyEmail(input);
  const smtp = getSmtpConfig();

  if (smtp) {
    await sendViaSmtp(smtp, input.to, input.subject, html);
    return;
  }

  if (process.env.RESEND_API_KEY) {
    await sendViaResend(input.to, input.subject, html);
  }
}
