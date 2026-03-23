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

  const parts: string[] = [
    "<p><strong>New form submission</strong></p>",
    `<p><strong>Site:</strong> ${escapeHtml(siteDisplayName)}</p>`,
  ];
  if (input.domain && input.brandName) {
    parts.push(`<p><strong>Domain:</strong> ${escapeHtml(input.domain)}</p>`);
  }
  parts.push(`<p><strong>Project ID:</strong> ${escapeHtml(input.projectId)}</p>`);

  if (input.pageSlug) parts.push(`<p><strong>Page:</strong> ${escapeHtml(input.pageSlug)}</p>`);
  if (name) parts.push(`<p><strong>Name:</strong> ${escapeHtml(name)}</p>`);
  if (email) parts.push(`<p><strong>Email:</strong> ${escapeHtml(email)}</p>`);
  if (phone) parts.push(`<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>`);
  if (issue) parts.push(`<p><strong>Topic:</strong> ${escapeHtml(issue)}</p>`);
  if (message) parts.push(`<p><strong>Message:</strong><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`);

  const subject = email
    ? `New lead: ${name || "Visitor"} (${email}) — ${siteDisplayName}`
    : `New lead from ${siteDisplayName}`;

  return { subject, html: parts.join("") };
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
