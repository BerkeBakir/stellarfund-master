// Brevo (Sendinblue) transactional email. No-op (skipped) when BREVO_API_KEY or
// BREVO_SENDER_EMAIL are unset, so the digest degrades gracefully.
export async function sendBrevoEmail(args: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ skipped: boolean; ok?: boolean }> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  if (!apiKey || !senderEmail) return { skipped: true };

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: process.env.BREVO_SENDER_NAME || 'StellarFund', email: senderEmail },
      to: [{ email: args.to }],
      subject: args.subject,
      htmlContent: args.html,
    }),
  });
  return { skipped: false, ok: res.ok };
}
