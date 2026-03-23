import nodemailer from "nodemailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function pickRecipientFromBlock(block?: { email?: string; leadNotificationEmail?: string } | null): string | null {
  const override =
    typeof block?.leadNotificationEmail === "string" ? block.leadNotificationEmail.trim() : "";
  const fallback = typeof block?.email === "string" ? block.email.trim() : "";
  const raw = override || fallback;
  if (!raw || !EMAIL_RE.test(raw)) return null;
  return raw;
}

function pickFromContactAgency(ag: unknown): string | null {
  const a = ag as { leadNotificationEmail?: string; infoItems?: Array<{ value?: string; href?: string }> } | undefined;
  const direct = pickRecipientFromBlock(a as { email?: string; leadNotificationEmail?: string });
  if (direct) return direct;
  const items = a?.infoItems;
  if (!Array.isArray(items)) return null;
  for (const it of items) {
    const v = typeof it?.value === "string" ? it.value.trim() : "";
    if (v && EMAIL_RE.test(v) && (typeof it?.href === "string" ? it.href.startsWith("mailto:") : true)) return v;
  }
  return null;
}

/** Resolves notification inbox from published section config (`contact`, `contactWithMap`, or `contactAgency`). */
export function getLeadNotificationRecipient(currentConfig: unknown): string | null {
  const c = currentConfig as {
    contact?: { email?: string; leadNotificationEmail?: string };
    contactWithMap?: { email?: string; leadNotificationEmail?: string };
    contactAgency?: { email?: string; leadNotificationEmail?: string; infoItems?: Array<{ value?: string; href?: string }> };
  } | null | undefined;

  return (
    pickRecipientFromBlock(c?.contact) ??
    pickRecipientFromBlock(c?.contactWithMap) ??
    pickFromContactAgency(c?.contactAgency)
  );
}

type LeadNotificationInput = {
  currentConfig: unknown;
  projectId: string;
  metadata: Record<string, unknown>;
  pageSlug?: string | null;
  brandName?: string | null;
  domain?: string | null;
};

function buildLeadEmailContent(input: LeadNotificationInput): { subject: string; html: string } {
  const meta = input.metadata;
  const name = typeof meta.name === "string" ? meta.name : "";
  const email = typeof meta.email === "string" ? meta.email : "";
  const message = typeof meta.message === "string" ? meta.message : "";
  const phone = typeof meta.phone === "string" ? meta.phone : "";
  const issue = typeof meta.issue === "string" ? meta.issue : "";

  const siteDisplayName = input.brandName || input.domain || "your site";
  const accentColor = "#10b981"; // EstabWeb Emerald
  const darkBlue = "#0f172a";

  // Build rows for the lead details table
  const rows: { label: string; value: string }[] = [];
  if (name) rows.push({ label: "Name", value: name });
  if (email) rows.push({ label: "Email", value: email });
  if (phone) rows.push({ label: "Phone", value: phone });
  if (issue) rows.push({ label: "Topic", value: issue });
  if (input.pageSlug) rows.push({ label: "Page", value: `/${input.pageSlug}` });
  if (input.domain) rows.push({ label: "Website", value: input.domain });

  const rowsHtml = rows
    .map(
      (r) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px; font-weight: 600; width: 100px; vertical-align: top;">${escapeHtml(r.label)}</td>
      <td style="padding: 12px 0 12px 20px; border-bottom: 1px solid #f1f5f9; color: ${darkBlue}; font-size: 14px; font-weight: 500; vertical-align: top;">${escapeHtml(r.value)}</td>
    </tr>`
    )
    .join("");

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
        <!-- Logo/Header -->
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin-bottom: 24px;">
          <tr>
            <td align="left">
              <span style="font-size: 20px; font-weight: 900; color: ${darkBlue}; letter-spacing: -0.5px; text-transform: uppercase;">ESTAB<span style="color: ${accentColor};">WEB</span></span>
            </td>
          </tr>
        </table>

        <!-- Main Card -->
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          <!-- Top Accent Bar -->
          <tr>
            <td height="4" style="background-color: ${accentColor};"></td>
          </tr>
          
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 800; color: ${darkBlue}; letter-spacing: -0.5px;">New form submission</h1>
              <p style="margin: 0 0 32px 0; font-size: 15px; color: #64748b; line-height: 1.5;">You received a new inquiry from <strong>${escapeHtml(siteDisplayName)}</strong>.</p>

              <!-- Details Table -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                ${rowsHtml}
              </table>

              <!-- Message Section -->
              ${
                message
                  ? `
              <div style="margin-top: 32px; padding: 24px; background-color: #f1f5f9; border-radius: 16px;">
                <p style="margin: 0 0 12px 0; font-size: 12px; font-weight: 800; color: #64748b; text-transform: uppercase; tracking: 0.05em;">Message</p>
                <p style="margin: 0; font-size: 15px; color: ${darkBlue}; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(message)}</p>
              </div>
              `
                  : ""
              }

              <!-- CTA -->
              <div style="margin-top: 40px; text-align: center;">
                <a href="mailto:${escapeHtml(email)}" style="display: inline-block; padding: 14px 32px; background-color: ${darkBlue}; color: #ffffff; text-decoration: none; border-radius: 12px; font-size: 14px; font-weight: 700; transition: all 0.2s;">Reply to Visitor</a>
              </div>
            </td>
          </tr>
        </table>

        <!-- Footer -->
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; margin-top: 24px;">
          <tr>
            <td align="center" style="font-size: 12px; color: #94a3b8;">
              <p style="margin: 0 0 8px 0;">This notification was sent by EstabWeb on behalf of ${escapeHtml(siteDisplayName)}.</p>
              <p style="margin: 0;">Project ID: ${escapeHtml(input.projectId)}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const subject = email
    ? `New lead: ${name || "Visitor"} (${email}) — ${siteDisplayName}`
    : `New lead from ${siteDisplayName}`;

  return { subject, html };
}

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

/**
 * Sends a notification email to the site owner's configured address.
 *
 * **Priority:** SMTP (Zoho Mail, Google Workspace, etc.) if `SMTP_HOST` + `SMTP_USER` + `SMTP_PASSWORD` are set;
 * otherwise Resend if `RESEND_API_KEY` is set. If neither is configured, no-op (lead is still stored in the DB).
 */
export async function sendLeadFormNotification(input: LeadNotificationInput): Promise<void> {
  const to = getLeadNotificationRecipient(input.currentConfig);
  if (!to) return;

  const { subject, html } = buildLeadEmailContent(input);

  const smtp = getSmtpConfig();
  if (smtp) {
    await sendViaSmtp(smtp, to, subject, html);
    return;
  }

  if (process.env.RESEND_API_KEY) {
    await sendViaResend(to, subject, html);
  }
}
