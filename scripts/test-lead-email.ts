/**
 * Sends one test “new lead” notification using the same code as production
 * (`sendLeadFormNotification`). Loads `.env.local` from the repo root.
 *
 * Usage (from project root):
 *   npx tsx scripts/test-lead-email.ts
 *
 * Optional env:
 *   TEST_LEAD_TO=owner@client.com   — override recipient (defaults to contact.email in TEST_LEAD_CONFIG)
 */
import { config } from "dotenv";
import { resolve } from "path";
import { getLeadNotificationRecipient, sendLeadFormNotification } from "../lib/email/lead-notification";

config({ path: resolve(process.cwd(), ".env.local") });
config({ path: resolve(process.cwd(), ".env") });

const testRecipient = process.env.TEST_LEAD_TO?.trim();

async function main() {
  if (!process.env.SMTP_HOST && !process.env.RESEND_API_KEY) {
    console.error(
      "Set SMTP_* (Zoho) or RESEND_API_KEY in .env.local — nothing will send without one of them.",
    );
    process.exit(1);
  }

  const to = testRecipient || process.env.SMTP_USER || "you@example.com";
  const currentConfig = { contact: { email: to } };

  const recipient = getLeadNotificationRecipient(currentConfig);
  console.log("Sending test lead notification to:", recipient ?? to);
  await sendLeadFormNotification({
    currentConfig,
    projectId: "test-script",
    metadata: {
      name: "Test Visitor",
      email: "visitor@example.com",
      message: "This is a test message from scripts/test-lead-email.ts",
    },
    pageSlug: "home",
  });
  console.log("Done. Check the inbox (and spam) for the notification.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
